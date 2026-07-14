from sqlalchemy.orm import Session
from app.repositories.employee_repo import EmployeeRepository
from app.models.user import User
from app.models.employee import Employee
from typing import Optional, List, Dict, Any, Tuple
from decimal import Decimal

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
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Retrieves a paginated and formatted list of employees.
        Enforces manager reporting scoping.
        """
        # If user is a Manager, override manager filter with the user's ID
        # to restrict query results to their reportees
        active_manager_id = manager_id
        if current_user.role.name == "Manager":
            active_manager_id = current_user.id

        skip = (page - 1) * limit
        employees, total = self.employee_repo.get_employees_paginated(
            skip=skip,
            limit=limit,
            search=search,
            manager_id=active_manager_id,
            department_id=department_id,
            designation=designation,
        )

        formatted_items = []
        for emp in employees:
            # 1. Sum current CTC components
            current_ctc = Decimal('0.0')
            if emp.current_salary:
                sal = emp.current_salary
                current_ctc = sal.fixed_pay + sal.variable_pay + sal.mediclaim + sal.gratuity + sal.retention_bonus
                
            # 2. Extract projected CTC
            projected_ctc = Decimal('0.0')
            if emp.projection:
                projected_ctc = emp.projection.projected_ctc
                
            # 3. Resolve planning status (Check if a plan has been created)
            planning_status = "Not Started"
            if emp.planning_inputs:
                # In our setup, seed plan inputs have status
                # If there are multiple plans, get the last status or default Submitted
                # We can iterate or take list index 0
                planning_status = emp.planning_inputs[0].status if len(emp.planning_inputs) > 0 else "Not Started"
            # 4. Calculate historical average increment
            historical_average_increment = None
            if emp.salary_history and len(emp.salary_history) >= 2:
                # Sort history by financial_year
                history = sorted(emp.salary_history, key=lambda x: x.financial_year)
                increments = []
                for i in range(1, len(history)):
                    prev_ctc = history[i - 1].ctc
                    curr_ctc = history[i].ctc
                    if prev_ctc and prev_ctc > 0:
                        inc_pct = ((curr_ctc - prev_ctc) / prev_ctc) * 100
                        increments.append(inc_pct)
                if increments:
                    historical_average_increment = sum(increments) / len(increments)

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
                "historical_average_increment": historical_average_increment
            })

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
