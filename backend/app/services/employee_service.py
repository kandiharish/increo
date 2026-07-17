from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.repositories.employee_repo import EmployeeRepository
from app.models.user import User
from app.models.employee import Employee
from app.models.current_salary import CurrentSalary
from app.models.projected_salary import ProjectedSalary
from typing import Optional, List, Dict, Any, Tuple
from decimal import Decimal
from app.services.calculation_engine import CalculationEngine

class EmployeeService:
    def __init__(self, db: Session):
        self.employee_repo = EmployeeRepository(db)

    def get_employees_list(
        self,
        current_user: User,
        page: int = 1,
        limit: int = 10,
        search: Optional[str] = None,
        department_id: Optional[int] = None,
        designation: Optional[str] = None,
        manager_id: Optional[int] = None,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None,
        highlight: Optional[List[str]] = None,
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Retrieves a paginated and formatted list of employees.
        Enforces manager reporting scoping.
        Includes three analytics columns: current_year_increment, historical_average_increment,
        and department_average_increment.
        Performs 3-step pipeline: Fetch -> Calculate -> Highlight/Sort/Paginate.
        """
        active_manager_id = manager_id
        if current_user.role.name == "Manager":
            active_manager_id = current_user.id

        # STEP 1: SQL Fetch (Unpaginated)
        employees = self.employee_repo.get_employees_unpaginated(
            search=search,
            manager_id=active_manager_id,
            department_id=department_id,
            designation=designation,
        )

        # ── Department Average Increment ─────────────────────────────────────
        # Pre-compute in ONE SQL aggregate grouped by department before the employee loop (avoids N+1).
        # Irrespective of the reporting manager.
        # Formula: AVG( ((projected_ctc - current_ctc) / current_ctc) * 100 )
        db = self.employee_repo.db
        current_ctc_expr = (
            CurrentSalary.fixed_pay +
            CurrentSalary.variable_pay +
            CurrentSalary.mediclaim +
            CurrentSalary.gratuity +
            CurrentSalary.retention_bonus
        )
        dept_avg_query = db.query(
            Employee.department_id,
            func.avg(
                case(
                    (
                        current_ctc_expr > 0,
                        ((ProjectedSalary.projected_ctc - current_ctc_expr) / current_ctc_expr) * 100
                    ),
                    else_=None
                )
            ).label("avg_inc")
        ).select_from(Employee)\
         .join(CurrentSalary, CurrentSalary.employee_id == Employee.id)\
         .join(ProjectedSalary, ProjectedSalary.employee_id == Employee.id)\
         .filter(Employee.status == "Active")\
         .group_by(Employee.department_id)

        dept_avg_results = dept_avg_query.all()
        dept_avg_dict = {
            row.department_id: round(float(row.avg_inc), 2) if row.avg_inc is not None else None
            for row in dept_avg_results
        }
        # ─────────────────────────────────────────────────────────────────────

        # STEP 2: Calculate Metrics
        formatted_items = []
        for emp in employees:
            current_ctc = Decimal('0.0')
            if emp.current_salary:
                sal = emp.current_salary
                current_ctc = sal.fixed_pay + sal.variable_pay + sal.mediclaim + sal.gratuity + sal.retention_bonus
                
            projected_ctc = Decimal('0.0')
            if emp.projection:
                projected_ctc = emp.projection.projected_ctc
                
            planning_status = "Not Started"
            if emp.planning_inputs:
                planning_status = emp.planning_inputs[0].status if len(emp.planning_inputs) > 0 else "Not Started"

            metrics = CalculationEngine.calculate_increment_metrics(current_ctc, projected_ctc)
            current_year_increment = metrics["current_year_increment_percentage"]

            historical_average_increment = None
            if emp.salary_history and len(emp.salary_history) >= 2:
                history = sorted(emp.salary_history, key=lambda x: x.financial_year)
                increments = []
                for i in range(1, len(history)):
                    prev_ctc = history[i - 1].ctc
                    curr_ctc = history[i].ctc
                    if prev_ctc and prev_ctc > 0:
                        inc_pct = float(((curr_ctc - prev_ctc) / prev_ctc) * 100)
                        increments.append(inc_pct)
                if increments:
                    historical_average_increment = round(sum(increments) / len(increments), 2)
            department_average_increment = dept_avg_dict.get(emp.department_id)

            formatted_items.append({
                "id": emp.id,
                "name": emp.name,
                "department_name": emp.department.name,
                "manager_name": emp.manager.full_name if emp.manager else None,
                "current_designation": emp.current_designation,
                "proposed_designation": emp.proposed_designation,
                "current_ctc": current_ctc,
                "projected_ctc": projected_ctc,
                "planning_status": planning_status,
                "current_year_increment": current_year_increment,
                "historical_average_increment": historical_average_increment,
                "department_average_increment": department_average_increment,
            })

        # STEP 3: Apply Highlights, Sorting, and Pagination
        
        # 3a. Highlight Filters
        if highlight:
            filtered_items = []
            for item in formatted_items:
                keep = True
                if "above_department_average" in highlight:
                    if item["current_year_increment"] is None or item["department_average_increment"] is None or item["current_year_increment"] <= item["department_average_increment"]:
                        keep = False
                if "below_department_average" in highlight:
                    if item["current_year_increment"] is None or item["department_average_increment"] is None or item["current_year_increment"] >= item["department_average_increment"]:
                        keep = False
                if "above_historical_average" in highlight:
                    if item["current_year_increment"] is None or item["historical_average_increment"] is None or item["current_year_increment"] <= item["historical_average_increment"]:
                        keep = False
                if "below_historical_average" in highlight:
                    if item["current_year_increment"] is None or item["historical_average_increment"] is None or item["current_year_increment"] >= item["historical_average_increment"]:
                        keep = False
                if "completed_planning" in highlight:
                    if item["planning_status"] != "Completed":
                        keep = False
                if "pending_planning" in highlight:
                    if item["planning_status"] not in ["Not Started", "In Progress", "Draft", "Pending"]: # Or just "Pending" depending on exact logic
                        # From UI: we have Not Started, In Progress, Completed
                        if item["planning_status"] == "Completed":
                            keep = False
                if "submitted" in highlight:
                    if item["planning_status"] != "Submitted":
                        keep = False
                if keep:
                    filtered_items.append(item)
            formatted_items = filtered_items

        # 3b. Sorting
        if sort_by:
            reverse = True if sort_order == "desc" else False
            
            def get_sort_key(item):
                val = item.get(sort_by)
                if val is None:
                    # Sort nulls to the bottom regardless of order, or use a sentinel
                    # For a generic solution:
                    if isinstance(item.get("current_ctc"), (int, float, Decimal)):
                        return float('-inf') if reverse else float('inf')
                    return ""
                return val

            # Special handling for name sort
            if sort_by == "name":
                formatted_items.sort(key=lambda x: (x["name"] or "").lower(), reverse=reverse)
            else:
                formatted_items.sort(key=get_sort_key, reverse=reverse)

        # 3c. Pagination
        total = len(formatted_items)
        skip = (page - 1) * limit
        formatted_items = formatted_items[skip : skip + limit]

        return formatted_items, total


    def get_employee_detail(self, employee_id: str, current_user: User) -> Optional[Employee]:

        """
        Fetches an employee detail profile and validates scoping permissions.
        Calculates historical average increment.
        """
        emp = self.employee_repo.get_by_id(employee_id)
        if not emp:
            return None
            
        # Manager role restriction: check if employee reports directly
        if current_user.role.name == "Manager" and emp.manager_id != current_user.id:
            return None

        # Calculate historical average increment
        from app.repositories.salary_repo import SalaryRepository
        salary_repo = SalaryRepository(self.employee_repo.db)
        history = salary_repo.get_history_by_employee_id(employee_id)
        
        historical_average_increment = None
        if len(history) >= 2:
            increments = []
            for i in range(1, len(history)):
                prev_ctc = history[i - 1].ctc
                curr_ctc = history[i].ctc
                if prev_ctc and prev_ctc > 0:
                    inc_pct = ((curr_ctc - prev_ctc) / prev_ctc) * 100
                    increments.append(inc_pct)
            
            if increments:
                historical_average_increment = sum(increments) / len(increments)
        
        emp.historical_average_increment = historical_average_increment
            
        return emp
