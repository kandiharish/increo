from sqlalchemy.orm import Session
from app.repositories.planning_repo import PlanningRepository
from app.repositories.salary_repo import SalaryRepository
from app.services.calculation_engine import CalculationEngine
from app.models.salary_plan import SalaryPlan
from app.models.projected_salary import ProjectedSalary
from app.models.employee import Employee
from app.models.audit_log import AuditLog
from decimal import Decimal
import json

class PlanningService:
    def __init__(self, db: Session):
        self.db = db
        self.planning_repo = PlanningRepository(db)
        self.salary_repo = SalaryRepository(db)

    def save_plan(
        self,
        employee_id: str,
        manager_id: int,
        fixed_pct: Decimal,
        var_pct: Decimal,
        ret_pct: Decimal,
        is_submit: bool = False
    ) -> ProjectedSalary:
        """
        Coordinates compensation calculations, writes/updates SalaryPlan & ProjectedSalary schemas,
        and logs the modifications inside the AuditLog table.
        """
        # 1. Scope and employee verification
        emp = self.db.query(Employee).filter(Employee.id == employee_id).first()
        if not emp:
            raise ValueError(f"Employee {employee_id} not found.")

        # Ensure manager line authorization: manager can only update their reportees
        if emp.manager_id != manager_id:
            raise PermissionError("Access denied: Not authorized to manage increments for this employee.")

        current_sal = self.salary_repo.get_current_by_employee_id(employee_id)
        if not current_sal:
            raise ValueError(f"No current salary record found for employee: {employee_id}")

        # 2. Domain calculation execution
        projection_data = CalculationEngine.calculate_projection(
            current_fixed=current_sal.fixed_pay,
            current_variable=current_sal.variable_pay,
            current_mediclaim=current_sal.mediclaim,
            current_gratuity=current_sal.gratuity,
            current_retention=current_sal.retention_bonus,
            pct_fixed=fixed_pct,
            pct_variable=var_pct,
            pct_retention=ret_pct
        )

        status_value = "Completed" if is_submit else "In Progress"

        # 3. Retrieve or create increment plan
        plan = self.db.query(SalaryPlan).filter(SalaryPlan.employee_id == employee_id).first()
        old_plan_data = {}
        if plan:
            old_plan_data = {
                "increment_pct_fixed": float(plan.increment_pct_fixed),
                "increment_pct_variable": float(plan.increment_pct_variable),
                "increment_pct_retention": float(plan.increment_pct_retention),
                "status": plan.status
            }
            plan.increment_pct_fixed = fixed_pct
            plan.increment_pct_variable = var_pct
            plan.increment_pct_retention = ret_pct
            plan.status = status_value
        else:
            plan = SalaryPlan(
                employee_id=employee_id,
                manager_id=manager_id,
                increment_pct_fixed=fixed_pct,
                increment_pct_variable=var_pct,
                increment_pct_retention=ret_pct,
                status=status_value
            )
            self.db.add(plan)

        # 4. Retrieve or create projected salary row
        projected = self.db.query(ProjectedSalary).filter(ProjectedSalary.employee_id == employee_id).first()
        if projected:
            projected.fixed_pay = projection_data["fixed_pay"]
            projected.variable_pay = projection_data["variable_pay"]
            projected.mediclaim = projection_data["mediclaim"]
            projected.gratuity = projection_data["gratuity"]
            projected.retention_bonus = projection_data["retention_bonus"]
            projected.projected_ctc = projection_data["projected_ctc"]
        else:
            projected = ProjectedSalary(
                employee_id=employee_id,
                fixed_pay=projection_data["fixed_pay"],
                variable_pay=projection_data["variable_pay"],
                mediclaim=projection_data["mediclaim"],
                gratuity=projection_data["gratuity"],
                retention_bonus=projection_data["retention_bonus"],
                projected_ctc=projection_data["projected_ctc"]
            )
            self.db.add(projected)

        # 5. Record activity in AuditLog
        new_plan_data = {
            "increment_pct_fixed": float(fixed_pct),
            "increment_pct_variable": float(var_pct),
            "increment_pct_retention": float(ret_pct),
            "status": status_value,
            "projected_ctc": float(projection_data["projected_ctc"])
        }

        audit_entry = AuditLog(
            user_id=manager_id,
            employee_id=employee_id,
            action="UPDATE_INCREMENT",
            old_values=json.dumps(old_plan_data),
            new_values=json.dumps(new_plan_data)
        )
        self.db.add(audit_entry)

        # 6. Commit transactions
        self.db.commit()
        self.db.refresh(projected)
        return projected
