from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.services.report_service import ReportService
from app.api.v1.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("")
def read_reports(
    department_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed payroll and increment planning reports.
    Scoped by manager reporting line.
    """
    service = ReportService(db)
    reports = service.get_reports_summary(current_user, department_id)
    return reports
