from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.planning import PlanningSaveRequest, CalculationRequest, CalculationResponse, PlanningPlanResponse
from app.services.planning_service import PlanningService
from app.services.calculation_engine import CalculationEngine
from app.api.v1.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/planning", tags=["planning"])

@router.get("/{employee_id}", response_model=PlanningPlanResponse)
def get_planning(
    employee_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get existing salary plan for an employee.
    """
    service = PlanningService(db)
    plan = service.planning_repo.get_plan_by_employee_id(employee_id)
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plan not found")
    # Verify manager access
    if current_user.role.name == "Manager" and plan.manager_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return plan

@router.post("/save")
def save_planning(
    payload: PlanningSaveRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Saves increment plans as draft status 'In Progress'.
    """
    service = PlanningService(db)
    try:
        projected = service.save_plan(
            employee_id=payload.employee_id,
            manager_id=current_user.id,
            fixed_pct=payload.increment_pct_fixed,
            var_pct=payload.increment_pct_variable,
            ret_pct=payload.increment_pct_retention,
            is_submit=False
        )
        return {
            "success": True,
            "message": "Planning draft saved successfully.",
            "projected_ctc": projected.projected_ctc
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

@router.post("/submit")
def submit_planning(
    payload: PlanningSaveRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits increment plans with locked status 'Completed'.
    """
    service = PlanningService(db)
    try:
        projected = service.save_plan(
            employee_id=payload.employee_id,
            manager_id=current_user.id,
            fixed_pct=payload.increment_pct_fixed,
            var_pct=payload.increment_pct_variable,
            ret_pct=payload.increment_pct_retention,
            is_submit=True
        )
        return {
            "success": True,
            "message": "Planning submitted successfully.",
            "projected_ctc": projected.projected_ctc
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

@router.post("/calculate", response_model=CalculationResponse)
def calculate_live_projection(payload: CalculationRequest):
    """
    Live calculate projected compensation components based on input variables.
    Does not save to database.
    """
    result = CalculationEngine.calculate_projection(
        current_fixed=payload.current_fixed,
        current_variable=payload.current_variable,
        current_mediclaim=payload.current_mediclaim,
        current_gratuity=payload.current_gratuity,
        current_retention=payload.current_retention,
        pct_fixed=payload.increment_pct_fixed,
        pct_variable=payload.increment_pct_variable,
        pct_retention=payload.increment_pct_retention
    )
    return result
