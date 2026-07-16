from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database.session import get_db
from app.models.department import Department
from app.api.v1.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/departments", tags=["departments"])

@router.get("")
def get_departments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all departments for dropdowns.
    """
    departments = db.query(Department).all()
    return [{"id": d.id, "name": d.name} for d in departments]
