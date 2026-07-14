from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.v1.dependencies import get_current_user, RoleChecker
from app.models.user import User
from app.repositories.dashboard_repo import DashboardRepository
from app.repositories.analytics_repo import AnalyticsRepository

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("")
def read_payroll_analytics(
    current_user: User = Depends(RoleChecker(["HR", "Director"])),
    db: Session = Depends(get_db)
):
    """
    Get advanced payroll analytics including year-over-year trends,
    department distribution, and salary band breakdowns.
    HR and Director access only.
    """
    repo = AnalyticsRepository(db)
    return repo.get_payroll_analytics()
