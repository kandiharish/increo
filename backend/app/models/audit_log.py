from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database.session import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True) # ID of user who made the change
    employee_id = Column(String, nullable=False) # ID of employee whose record was modified
    action = Column(String, nullable=False) # e.g. "UPDATE_INCREMENT"
    old_values = Column(Text, nullable=True) # JSON string of prior inputs
    new_values = Column(Text, nullable=True) # JSON string of new inputs
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
