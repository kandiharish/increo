from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import List, Dict, Any, Tuple
from app.models.employee import Employee
from app.models.current_salary import CurrentSalary
from app.models.projected_salary import ProjectedSalary
from app.models.department import Department
from app.models.salary_plan import SalaryPlan

class ReportRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_department_payroll_summary(self, manager_id: int = None, department_id: int = None) -> List[Dict[str, Any]]:
        """
        Returns a summary list of department stats: (name, count, current, projected).
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
         .filter(Employee.status == "Active")

        if manager_id is not None:
            query = query.filter(Employee.manager_id == manager_id)
        if department_id is not None:
            query = query.filter(Employee.department_id == department_id)

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
                "payroll_growth": proj - cur,
                "avg_planned_increment": float(r.avg_planned_increment or 0.0)
            })
        return breakdown

    def get_increment_report_data(self, manager_id: int = None, department_id: int = None) -> List[Dict[str, Any]]:
        """
        Gathers complete report list of employees, current/projected CTCs, and planned percentages.
        """
        query = self.db.query(Employee).options(
            joinedload(Employee.department),
            joinedload(Employee.manager),
            joinedload(Employee.current_salary),
            joinedload(Employee.projection),
            joinedload(Employee.planning_inputs)
        ).filter(Employee.status == "Active")

        if manager_id is not None:
            query = query.filter(Employee.manager_id == manager_id)
        if department_id is not None:
            query = query.filter(Employee.department_id == department_id)

        employees = query.all()

        result = []
        for emp in employees:
            cur_fixed = float(emp.current_salary.fixed_pay) if emp.current_salary else 0.0
            cur_var = float(emp.current_salary.variable_pay) if emp.current_salary else 0.0
            cur_med = float(emp.current_salary.mediclaim) if emp.current_salary else 0.0
            cur_grat = float(emp.current_salary.gratuity) if emp.current_salary else 0.0
            cur_ret = float(emp.current_salary.retention_bonus) if emp.current_salary else 0.0
            current_ctc = cur_fixed + cur_var + cur_med + cur_grat + cur_ret

            projected_ctc = float(emp.projection.projected_ctc) if emp.projection else current_ctc

            pct_fixed = 0.0
            pct_var = 0.0
            pct_ret = 0.0
            status_val = "Not Started"
            if emp.planning_inputs and len(emp.planning_inputs) > 0:
                plan = emp.planning_inputs[0]
                pct_fixed = float(plan.increment_pct_fixed)
                pct_var = float(plan.increment_pct_variable)
                pct_ret = float(plan.increment_pct_retention)
                status_val = plan.status

            result.append({
                "employee_id": emp.id,
                "name": emp.name,
                "department_name": emp.department.name,
                "current_ctc": current_ctc,
                "projected_ctc": projected_ctc,
                "difference": projected_ctc - current_ctc,
                "increment_pct_fixed": pct_fixed,
                "increment_pct_variable": pct_var,
                "increment_pct_retention": pct_ret,
                "status": status_val
            })
        return result
