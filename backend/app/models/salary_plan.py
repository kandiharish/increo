from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.session import Base

class SalaryPlan(Base):
    __tablename__ = "increment_plans"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.id"), nullable=False)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    increment_pct_fixed = Column(Numeric(precision=5, scale=2), default=0.0)
    increment_pct_variable = Column(Numeric(precision=5, scale=2), default=0.0)
    increment_pct_retention = Column(Numeric(precision=5, scale=2), default=0.0)
    status = Column(String, default="Draft") # 'Draft', 'Submitted'
    planning_date = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    employee = relationship("Employee", foreign_keys=[employee_id], back_populates="planning_inputs")
    manager = relationship("User", foreign_keys=[manager_id])
