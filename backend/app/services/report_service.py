from sqlalchemy.orm import Session
from app.repositories.report_repo import ReportRepository
from app.models.user import User
from typing import List, Dict, Any

class ReportService:
    def __init__(self, db: Session):
        self.report_repo = ReportRepository(db)

    def get_reports_summary(self, current_user: User, department_id: int = None) -> Dict[str, Any]:
        """
        Coordinates database queries to fetch department payrolls and employee detailed lists.
        Handles manager scoping rule checks.
        """
        manager_id = current_user.id if current_user.role.name == "Manager" else None

        departments = self.report_repo.get_department_payroll_summary(manager_id)
        records = self.report_repo.get_increment_report_data(manager_id, department_id)

        return {
            "departments": departments,
            "records": records
        }
