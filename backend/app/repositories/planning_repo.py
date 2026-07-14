from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.salary_plan import SalaryPlan
from app.models.projected_salary import ProjectedSalary

class PlanningRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_plan_by_employee_id(self, employee_id: str) -> Optional[SalaryPlan]:
        return self.db.query(SalaryPlan).filter(SalaryPlan.employee_id == employee_id).first()

    def get_projection_by_employee_id(self, employee_id: str) -> Optional[ProjectedSalary]:
        return self.db.query(ProjectedSalary).filter(ProjectedSalary.employee_id == employee_id).first()

    def save_plan(self, plan: SalaryPlan) -> SalaryPlan:
        self.db.add(plan)
        self.db.commit()
        self.db.refresh(plan)
        return plan

    def save_projection(self, projection: ProjectedSalary) -> ProjectedSalary:
        self.db.add(projection)
        self.db.commit()
        self.db.refresh(projection)
        return projection

    def get_plans_by_manager(self, manager_id: str) -> List[SalaryPlan]:
        return self.db.query(SalaryPlan).filter(SalaryPlan.manager_id == manager_id).all()
