from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import Dict, Any, Optional
from app.models.employee import Employee
from app.models.current_salary import CurrentSalary
from app.models.projected_salary import ProjectedSalary
from app.models.salary_history import SalaryHistory
from app.models.salary_plan import SalaryPlan
from app.services.calculation_engine import CalculationEngine
from decimal import Decimal


class EmployeeAnalyticsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_employee_analytics(
        self,
        employee_id: str,
        manager_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Returns three analytics values for a single employee:
        1. current_year_increment: ((projected_ctc - current_ctc) / current_ctc) * 100
        2. historical_average_increment: avg YoY % from salary_history
        3. department_average_increment: avg ((projected - current) / current) * 100
           for all employees in the same department
        """

        # ─── 1. Current Year Increment for this employee ─────────────────────
        current_year_increment = None

        current_ctc_expr = (
            CurrentSalary.fixed_pay +
            CurrentSalary.variable_pay +
            CurrentSalary.mediclaim +
            CurrentSalary.gratuity +
            CurrentSalary.retention_bonus
        )

        row = (
            self.db.query(current_ctc_expr, ProjectedSalary.projected_ctc)
            .join(ProjectedSalary, ProjectedSalary.employee_id == CurrentSalary.employee_id)
            .filter(CurrentSalary.employee_id == employee_id)
            .first()
        )
        if row and row[0] and float(row[0]) > 0:
            current_ctc_val = Decimal(str(row[0]))
            projected_ctc_val = Decimal(str(row[1] or 0))
            metrics = CalculationEngine.calculate_increment_metrics(current_ctc_val, projected_ctc_val)
            current_year_increment = metrics["current_year_increment_percentage"]

        # ─── 2. Historical Average Increment for this employee ───────────────
        historical_average_increment = None

        history = (
            self.db.query(SalaryHistory)
            .filter(SalaryHistory.employee_id == employee_id)
            .order_by(SalaryHistory.financial_year.asc())
            .all()
        )
        if len(history) >= 2:
            increments = []
            for i in range(1, len(history)):
                prev_ctc = float(history[i - 1].ctc or 0)
                curr_ctc = float(history[i].ctc or 0)
                if prev_ctc > 0:
                    increments.append(((curr_ctc - prev_ctc) / prev_ctc) * 100)
            if increments:
                historical_average_increment = round(sum(increments) / len(increments), 2)

        # ─── 3. Department Average Increment ────────────────────────────────────────
        # Average of ((projected_ctc - current_ctc) / current_ctc) * 100
        # scoped to all employees in the same department
        
        # Get employee's department_id
        emp = self.db.query(Employee).filter(Employee.id == employee_id).first()
        department_average_increment = None
        
        if emp:
            dept_avg_query = self.db.query(
                func.avg(
                    case(
                        (
                            current_ctc_expr > 0,
                            ((ProjectedSalary.projected_ctc - current_ctc_expr) / current_ctc_expr) * 100
                        ),
                        else_=None
                    )
                )
            ).select_from(Employee)\
             .join(CurrentSalary, CurrentSalary.employee_id == Employee.id)\
             .join(ProjectedSalary, ProjectedSalary.employee_id == Employee.id)\
             .filter(Employee.status == "Active", Employee.department_id == emp.department_id)

            dept_avg_scalar = dept_avg_query.scalar()
            department_average_increment = round(float(dept_avg_scalar), 2) if dept_avg_scalar is not None else None

        return {
            "current_year_increment": current_year_increment,
            "historical_average_increment": historical_average_increment,
            "department_average_increment": department_average_increment,
        }
