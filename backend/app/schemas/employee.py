from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from decimal import Decimal

class DepartmentOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class ManagerOut(BaseModel):
    id: int
    full_name: str

    class Config:
        from_attributes = True

class EmployeeListItem(BaseModel):
    id: str
    name: str
    department_name: str
    manager_name: Optional[str] = None
    current_designation: str
    proposed_designation: Optional[str] = None
    current_ctc: Decimal
    projected_ctc: Decimal
    planning_status: str
    current_year_increment: Optional[Decimal] = None
    historical_average_increment: Optional[Decimal] = None
    department_average_increment: Optional[Decimal] = None

class PaginatedEmployeeResponse(BaseModel):
    items: List[EmployeeListItem]
    total: int
    page: int
    limit: int

class EmployeeDetail(BaseModel):
    id: str
    name: str
    doj: date
    current_designation: str
    proposed_designation: Optional[str] = None
    status: str
    department: DepartmentOut
    manager: Optional[ManagerOut] = None
    historical_average_increment: Optional[Decimal] = None

    class Config:
        from_attributes = True

class SalaryHistoryOut(BaseModel):
    financial_year: str
    ctc: Decimal

    class Config:
        from_attributes = True

class CurrentSalaryOut(BaseModel):
    fixed_pay: Decimal
    variable_pay: Decimal
    mediclaim: Decimal
    gratuity: Decimal
    retention_bonus: Decimal
    total_ctc: Decimal

    class Config:
        from_attributes = True

class ProjectedSalaryOut(BaseModel):
    fixed_pay: Decimal
    variable_pay: Decimal
    mediclaim: Decimal
    gratuity: Decimal
    retention_bonus: Decimal
    projected_ctc: Decimal

    class Config:
        from_attributes = True
