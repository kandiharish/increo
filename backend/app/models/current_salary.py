from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.database.session import Base

class CurrentSalary(Base):
    __tablename__ = "current_salary"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.id"), unique=True, nullable=False)
    fixed_pay = Column(Numeric(precision=15, scale=2), nullable=False)
    variable_pay = Column(Numeric(precision=15, scale=2), default=0.0)
    mediclaim = Column(Numeric(precision=15, scale=2), default=0.0)
    gratuity = Column(Numeric(precision=15, scale=2), default=0.0)
    retention_bonus = Column(Numeric(precision=15, scale=2), default=0.0)
    financial_year = Column(String, default="2025_26")

    employee = relationship("Employee", back_populates="current_salary")
