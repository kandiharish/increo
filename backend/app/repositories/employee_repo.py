from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List, Optional, Tuple
from app.models.employee import Employee

class EmployeeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, employee_id: str) -> Optional[Employee]:
        return (
            self.db.query(Employee)
            .options(
                joinedload(Employee.department),
                joinedload(Employee.manager)
            )
            .filter(Employee.id == employee_id)
            .first()
        )

    def get_employees_paginated(
        self,
        skip: int = 0,
        limit: int = 10,
        search: Optional[str] = None,
        manager_id: Optional[int] = None,
        department_id: Optional[int] = None,
        designation: Optional[str] = None,
    ) -> Tuple[List[Employee], int]:
        """
        Fetch a paginated list of employees with joins to prevent N+1 queries.
        Supports search filters (by name, ID, or designation) and role scopes.
        """
        query = self.db.query(Employee).options(
            joinedload(Employee.department),
            joinedload(Employee.manager),
            joinedload(Employee.current_salary),
            joinedload(Employee.planning_inputs),
            joinedload(Employee.projection),
            joinedload(Employee.salary_history)
        )
        
        # Apply role scoping/filters
        if manager_id is not None:
            query = query.filter(Employee.manager_id == manager_id)
        if department_id is not None:
            query = query.filter(Employee.department_id == department_id)
        if designation:
            query = query.filter(Employee.current_designation == designation)
            
        # Apply search text (name, id, or current designation)
        if search:
            query = query.filter(
                or_(
                    Employee.name.ilike(f"%{search}%"),
                    Employee.id.ilike(f"%{search}%"),
                    Employee.current_designation.ilike(f"%{search}%")
                )
            )
            
        total = query.count()
        results = query.offset(skip).limit(limit).all()
        return results, total
