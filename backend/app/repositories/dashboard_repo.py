import json
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Dict, Any, List
from app.models.employee import Employee
from app.models.current_salary import CurrentSalary
from app.models.projected_salary import ProjectedSalary
from app.models.salary_plan import SalaryPlan
from app.models.department import Department
from app.models.audit_log import AuditLog

class DashboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_kpis(self, manager_id: int = None) -> Dict[str, Any]:
        """
        Aggregate total employees, total current payroll, projected payroll, and completion percentage.
        Supports filtering by manager_id for team scoping.
        """
        # 1. Employee Count
        emp_query = self.db.query(Employee).filter(Employee.status == "Active")
        if manager_id is not None:
            emp_query = emp_query.filter(Employee.manager_id == manager_id)
        total_employees = emp_query.count()

        # 2. Current Payroll
        cur_pay_query = self.db.query(
            func.sum(
                CurrentSalary.fixed_pay + 
                CurrentSalary.variable_pay + 
                CurrentSalary.mediclaim + 
                CurrentSalary.gratuity + 
                CurrentSalary.retention_bonus
            )
        ).join(Employee, Employee.id == CurrentSalary.employee_id).filter(Employee.status == "Active")
        if manager_id is not None:
            cur_pay_query = cur_pay_query.filter(Employee.manager_id == manager_id)
        current_payroll = cur_pay_query.scalar() or 0.0

        # 3. Projected Payroll
        proj_pay_query = self.db.query(
            func.sum(ProjectedSalary.projected_ctc)
        ).join(Employee, Employee.id == ProjectedSalary.employee_id).filter(Employee.status == "Active")
        if manager_id is not None:
            proj_pay_query = proj_pay_query.filter(Employee.manager_id == manager_id)
        projected_payroll = proj_pay_query.scalar() or 0.0

        # If projected payroll is 0 (no plans created yet), default to current payroll
        if projected_payroll == 0.0:
            projected_payroll = current_payroll

        # 4. Planning Progress counts
        plan_query = self.db.query(
            SalaryPlan.status,
            func.count(SalaryPlan.id)
        ).join(Employee, Employee.id == SalaryPlan.employee_id).filter(Employee.status == "Active")
        if manager_id is not None:
            plan_query = plan_query.filter(Employee.manager_id == manager_id)
        plan_counts = dict(plan_query.group_by(SalaryPlan.status).all())

        completed_count = plan_counts.get("Completed", 0)
        inprogress_count = plan_counts.get("In Progress", 0)
        notstarted_count = max(0, total_employees - completed_count - inprogress_count)

        completion_rate = (completed_count / total_employees * 100) if total_employees > 0 else 0.0

        return {
            "total_employees": total_employees,
            "current_payroll": float(current_payroll),
            "projected_payroll": float(projected_payroll),
            "payroll_growth": float(projected_payroll - current_payroll),
            "payroll_growth_pct": float(((projected_payroll - current_payroll) / current_payroll * 100) if current_payroll > 0 else 0.0),
            "completed_count": completed_count,
            "inprogress_count": inprogress_count,
            "notstarted_count": notstarted_count,
            "completion_rate": float(completion_rate)
        }

    def get_department_breakdown(self, manager_id: int = None) -> List[Dict[str, Any]]:
        """
        Calculates employee counts, current and projected budgets, and average increments per department.
        """
        current_ctc_sum = (
            CurrentSalary.fixed_pay + 
            CurrentSalary.variable_pay + 
            CurrentSalary.mediclaim + 
            CurrentSalary.gratuity + 
            CurrentSalary.retention_bonus
        )
        
        from sqlalchemy import case
        
        query = self.db.query(
            Department.name.label("department_name"),
            func.count(Employee.id).label("employee_count"),
            func.sum(current_ctc_sum).label("current_payroll"),
            func.sum(ProjectedSalary.projected_ctc).label("projected_payroll"),
            func.avg(
                case(
                    (
                        current_ctc_sum > 0,
                        ((ProjectedSalary.projected_ctc - current_ctc_sum) / current_ctc_sum) * 100
                    ),
                    else_=0.0
                )
            ).label("avg_planned_increment")
        ).select_from(Employee)\
         .join(Department, Department.id == Employee.department_id)\
         .outerjoin(CurrentSalary, CurrentSalary.employee_id == Employee.id)\
         .outerjoin(ProjectedSalary, ProjectedSalary.employee_id == Employee.id)\
         .outerjoin(SalaryPlan, SalaryPlan.employee_id == Employee.id)\
         .filter(Employee.status == "Active")

        if manager_id is not None:
            query = query.filter(Employee.manager_id == manager_id)

        rows = query.group_by(Department.name).all()

        breakdown = []
        for r in rows:
            cur = float(r.current_payroll or 0.0)
            proj = float(r.projected_payroll or 0.0)
            if proj == 0.0:
                proj = cur

            breakdown.append({
                "department_name": r.department_name,
                "employee_count": r.employee_count,
                "current_payroll": cur,
                "projected_payroll": proj,
                "avg_planned_increment": float(r.avg_planned_increment or 0.0)
            })
        return breakdown

    def get_recent_activities(self, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Pull the latest audit trail logs.
        """
        logs = self.db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
        result = []
        for log in logs:
            result.append({
                "id": log.id,
                "employee_id": log.employee_id,
                "action": log.action,
                "timestamp": log.timestamp.isoformat(),
                "new_values": json.loads(log.new_values) if log.new_values else {}
            })
        return result
