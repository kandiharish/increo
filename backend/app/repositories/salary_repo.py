from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.current_salary import CurrentSalary
from app.models.salary_history import SalaryHistory

class SalaryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_current_by_employee_id(self, employee_id: str) -> Optional[CurrentSalary]:
        return self.db.query(CurrentSalary).filter(CurrentSalary.employee_id == employee_id).first()

    def get_history_by_employee_id(self, employee_id: str) -> List[SalaryHistory]:
        return self.db.query(SalaryHistory).filter(SalaryHistory.employee_id == employee_id).order_by(SalaryHistory.financial_year.asc()).all()

    def create_current(self, salary: CurrentSalary) -> CurrentSalary:
        self.db.add(salary)
        self.db.commit()
        self.db.refresh(salary)
        return salary

    def create_history(self, history: SalaryHistory) -> SalaryHistory:
        self.db.add(history)
        self.db.commit()
        self.db.refresh(history)
        return history
