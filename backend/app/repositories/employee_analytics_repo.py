from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import Dict, Any, Optional
from app.models.employee import Employee
from app.models.current_salary import CurrentSalary
from app.models.projected_salary import ProjectedSalary
from app.models.salary_history import SalaryHistory
from app.models.salary_plan import SalaryPlan


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
        3. team_average_increment: avg ((projected - current) / current) * 100
           for all employees visible to the requesting manager
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
            current_ctc_val = float(row[0])
            projected_ctc_val = float(row[1])
            current_year_increment = round(
                ((projected_ctc_val - current_ctc_val) / current_ctc_val) * 100, 2
            )

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

        # ─── 3. Team Average Increment ────────────────────────────────────────
        # Average of ((projected_ctc - current_ctc) / current_ctc) * 100
        # scoped to employees visible to the manager (or org-wide for HR/Director)
        team_avg_query = self.db.query(
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
         .filter(Employee.status == "Active")

        if manager_id is not None:
            team_avg_query = team_avg_query.filter(Employee.manager_id == manager_id)

        team_avg_scalar = team_avg_query.scalar()
        team_average_increment = round(float(team_avg_scalar), 2) if team_avg_scalar is not None else None

        return {
            "current_year_increment": current_year_increment,
            "historical_average_increment": historical_average_increment,
            "team_average_increment": team_average_increment,
        }
