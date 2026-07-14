# Import all models here so that Alembic can detect them
from app.database.session import Base
from app.models.role import Role
from app.models.user import User
from app.models.department import Department
from app.models.employee import Employee
from app.models.salary_history import SalaryHistory
from app.models.current_salary import CurrentSalary
from app.models.salary_plan import SalaryPlan
from app.models.projected_salary import ProjectedSalary
from app.models.audit_log import AuditLog
