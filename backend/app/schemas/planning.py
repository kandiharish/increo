from pydantic import BaseModel, Field
from decimal import Decimal

class PlanningSaveRequest(BaseModel):
    employee_id: str
    increment_pct_fixed: Decimal = Field(..., ge=0, le=100)
    increment_pct_variable: Decimal = Field(..., ge=0, le=100)
    increment_pct_retention: Decimal = Field(..., ge=0, le=100)

class CalculationRequest(BaseModel):
    current_fixed: Decimal
    current_variable: Decimal
    current_mediclaim: Decimal
    current_gratuity: Decimal
    current_retention: Decimal
    increment_pct_fixed: Decimal
    increment_pct_variable: Decimal
    increment_pct_retention: Decimal

class CalculationResponse(BaseModel):
    fixed_pay: Decimal
    variable_pay: Decimal
    mediclaim: Decimal
    gratuity: Decimal
    retention_bonus: Decimal
    projected_ctc: Decimal
