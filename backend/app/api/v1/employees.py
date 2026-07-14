from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database.session import get_db
from app.schemas.employee import (
    PaginatedEmployeeResponse,
    EmployeeDetail,
    SalaryHistoryOut,
    CurrentSalaryOut,
    ProjectedSalaryOut
)
from app.services.employee_service import EmployeeService
from app.repositories.salary_repo import SalaryRepository
from app.repositories.planning_repo import PlanningRepository
from app.api.v1.dependencies import get_current_user, RoleChecker
from app.models.user import User

router = APIRouter(prefix="/employees", tags=["employees"])

@router.get("", response_model=PaginatedEmployeeResponse)
def get_employees(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=500),
    search: Optional[str] = Query(None),
    department_id: Optional[int] = Query(None),
    designation: Optional[str] = Query(None),
    manager_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a paginated list of employees. Enforces role scoping:
    - Managers only see their direct reportees.
    - HR and Directors see the entire organization.
    """
    service = EmployeeService(db)
    items, total = service.get_employees_list(
        current_user=current_user,
        page=page,
        limit=limit,
        search=search,
        department_id=department_id,
        designation=designation,
        manager_id=manager_id
    )
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }

@router.get("/{employee_id}", response_model=EmployeeDetail)
def get_employee_by_id(
    employee_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve employee profile metadata by ID.
    Enforces reporting line security scope.
    """
    service = EmployeeService(db)
    emp = service.get_employee_detail(employee_id, current_user)
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found or access denied."
        )
    return emp

@router.get("/{employee_id}/salary-history", response_model=List[SalaryHistoryOut])
def get_employee_history(
    employee_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve employee historical CTC records by ID.
    """
    # Enforce scope check first
    service = EmployeeService(db)
    emp = service.get_employee_detail(employee_id, current_user)
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found or access denied."
        )
        
    salary_repo = SalaryRepository(db)
    history = salary_repo.get_history_by_employee_id(employee_id)
    return history

@router.get("/{employee_id}/current-salary", response_model=CurrentSalaryOut)
def get_employee_current_salary(
    employee_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve current salary components (FY 2025-26) by ID.
    """
    service = EmployeeService(db)
    emp = service.get_employee_detail(employee_id, current_user)
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found or access denied."
        )
        
    salary_repo = SalaryRepository(db)
    salary = salary_repo.get_current_by_employee_id(employee_id)
    if not salary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No current salary records found for this employee."
        )
        
    # Calculate sum ctc
    total_ctc = salary.fixed_pay + salary.variable_pay + salary.mediclaim + salary.gratuity + salary.retention_bonus
    return {
        "fixed_pay": salary.fixed_pay,
        "variable_pay": salary.variable_pay,
        "mediclaim": salary.mediclaim,
        "gratuity": salary.gratuity,
        "retention_bonus": salary.retention_bonus,
        "total_ctc": total_ctc
    }

@router.get("/{employee_id}/projection", response_model=ProjectedSalaryOut)
def get_employee_projection(
    employee_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve projected salary components (FY 2026-27) by ID.
    """
    service = EmployeeService(db)
    emp = service.get_employee_detail(employee_id, current_user)
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found or access denied."
        )
        
    planning_repo = PlanningRepository(db)
    projection = planning_repo.get_projection_by_employee_id(employee_id)
    if not projection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No projected salary records found for this employee."
        )
    return projection
