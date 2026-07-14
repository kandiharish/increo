from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.database.session import Base

class ProjectedSalary(Base):
    __tablename__ = "projected_salary"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.id"), unique=True, nullable=False)
    fixed_pay = Column(Numeric(precision=15, scale=2), nullable=False)
    variable_pay = Column(Numeric(precision=15, scale=2), default=0.0)
    mediclaim = Column(Numeric(precision=15, scale=2), default=0.0)
    gratuity = Column(Numeric(precision=15, scale=2), default=0.0)
    retention_bonus = Column(Numeric(precision=15, scale=2), default=0.0)
    projected_ctc = Column(Numeric(precision=15, scale=2), nullable=False)
    financial_year = Column(String, default="2026_27")

    employee = relationship("Employee", back_populates="projection")
