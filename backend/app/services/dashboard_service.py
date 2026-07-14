from sqlalchemy.orm import Session
from app.repositories.dashboard_repo import DashboardRepository
from app.models.user import User
from typing import Dict, Any

class DashboardService:
    def __init__(self, db: Session):
        self.dashboard_repo = DashboardRepository(db)

    def get_dashboard_summary(self, current_user: User) -> Dict[str, Any]:
        """
        Gathers dashboard metrics, department details, and recent updates.
        Scopes automatically based on user roles.
        """
        # Manager role restricts scope to their reportees
        manager_id = current_user.id if current_user.role.name == "Manager" else None

        kpis = self.dashboard_repo.get_kpis(manager_id)
        departments = self.dashboard_repo.get_department_breakdown(manager_id)
        activities = self.dashboard_repo.get_recent_activities(limit=5)

        return {
            "kpis": kpis,
            "departments": departments,
            "activities": activities
        }
