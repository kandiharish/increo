from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database.session import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(String, primary_key=True, index=True) # "INT00002", etc.
    name = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    doj = Column(Date, nullable=False)
    current_designation = Column(String, nullable=False)
    proposed_designation = Column(String, nullable=True)
    status = Column(String, default="Active") # 'Active', 'Terminated'

    department = relationship("Department", back_populates="employees")
    manager = relationship("User", foreign_keys=[manager_id], back_populates="reportees")
    
    # Relationships to salary tables
    salary_history = relationship("SalaryHistory", back_populates="employee", cascade="all, delete-orphan")
    current_salary = relationship("CurrentSalary", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    planning_inputs = relationship("SalaryPlan", foreign_keys="[SalaryPlan.employee_id]", back_populates="employee", cascade="all, delete-orphan")
    projection = relationship("ProjectedSalary", back_populates="employee", uselist=False, cascade="all, delete-orphan")
