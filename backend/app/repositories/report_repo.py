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

    def get_analysis_data(self, manager_id: int = None, threshold: float = 5.0) -> Dict[str, Any]:
        """
        Calculates outliers and fairness alerts based on department and designation averages.
        """
        query = self.db.query(Employee).options(
            joinedload(Employee.department),
            joinedload(Employee.manager),
            joinedload(Employee.current_salary),
            joinedload(Employee.projection),
            joinedload(Employee.salary_history)
        ).filter(Employee.status == "Active")

        # Must fetch all employees to calculate accurate averages across the org
        all_employees = query.all()

        dept_sums, dept_counts = {}, {}
        desig_sums, desig_counts = {}, {}
        employee_data = []

        for emp in all_employees:
            cur_fixed = float(emp.current_salary.fixed_pay) if emp.current_salary else 0.0
            cur_var = float(emp.current_salary.variable_pay) if emp.current_salary else 0.0
            cur_med = float(emp.current_salary.mediclaim) if emp.current_salary else 0.0
            cur_grat = float(emp.current_salary.gratuity) if emp.current_salary else 0.0
            cur_ret = float(emp.current_salary.retention_bonus) if emp.current_salary else 0.0
            current_ctc = cur_fixed + cur_var + cur_med + cur_grat + cur_ret

            projected_ctc = float(emp.projection.projected_ctc) if emp.projection else current_ctc
            increment_pct = 0.0
            if current_ctc > 0:
                increment_pct = ((projected_ctc - current_ctc) / current_ctc) * 100

            hist_avg = 0.0
            if emp.salary_history and len(emp.salary_history) > 1:
                hist = sorted(emp.salary_history, key=lambda x: x.financial_year)
                total_growth = 0
                count = 0
                for i in range(1, len(hist)):
                    prev_ctc = float(hist[i-1].ctc)
                    curr_ctc = float(hist[i].ctc)
                    if prev_ctc > 0:
                        total_growth += ((curr_ctc - prev_ctc) / prev_ctc) * 100
                        count += 1
                if count > 0:
                    hist_avg = total_growth / count

            dept_name = emp.department.name if emp.department else "Unknown"
            desig = emp.current_designation

            dept_sums[dept_name] = dept_sums.get(dept_name, 0) + increment_pct
            dept_counts[dept_name] = dept_counts.get(dept_name, 0) + 1
            desig_sums[desig] = desig_sums.get(desig, 0) + increment_pct
            desig_counts[desig] = desig_counts.get(desig, 0) + 1

            employee_data.append({
                "employee_id": emp.id,
                "name": emp.name,
                "department_name": dept_name,
                "designation": desig,
                "increment_pct": increment_pct,
                "historical_avg": hist_avg,
                "manager_id": emp.manager_id
            })

        dept_averages = {d: dept_sums[d] / dept_counts[d] for d in dept_sums}
        desig_averages = {d: desig_sums[d] / desig_counts[d] for d in desig_sums}

        outliers = []
        fairness = []

        for ed in employee_data:
            if manager_id is not None and ed["manager_id"] != manager_id:
                continue

            dept_avg = dept_averages.get(ed["department_name"], 0)
            desig_avg = desig_averages.get(ed["designation"], 0)
            inc = ed["increment_pct"]

            # Outlier Analysis
            outlier_status = "Normal"
            reason = ""
            diff_dept = inc - dept_avg
            
            is_high_dept = diff_dept > threshold
            is_low_dept = diff_dept < -threshold
            
            diff_hist = inc - ed["historical_avg"] if ed["historical_avg"] > 0 else 0
            is_high_hist = diff_hist > threshold and ed["historical_avg"] > 0
            is_low_hist = diff_hist < -threshold and ed["historical_avg"] > 0

            if is_high_dept or is_high_hist:
                outlier_status = "High Outlier"
                if is_high_dept and is_high_hist:
                    reason = f"Increment is {diff_dept:.1f}% above dept average and {diff_hist:.1f}% above historical average."
                elif is_high_dept:
                    reason = f"Increment is {diff_dept:.1f}% above department average."
                else:
                    reason = f"Increment is {diff_hist:.1f}% above personal historical average."
            elif is_low_dept or is_low_hist:
                outlier_status = "Low Outlier"
                if is_low_dept and is_low_hist:
                    reason = f"Increment is {abs(diff_dept):.1f}% below dept average and {abs(diff_hist):.1f}% below historical average."
                elif is_low_dept:
                    reason = f"Increment is {abs(diff_dept):.1f}% below department average."
                else:
                    reason = f"Increment is {abs(diff_hist):.1f}% below personal historical average."

            if outlier_status != "Normal":
                outliers.append({
                    "employee_id": ed["employee_id"],
                    "name": ed["name"],
                    "department_name": ed["department_name"],
                    "current_increment": round(inc, 2),
                    "department_avg": round(dept_avg, 2),
                    "historical_avg": round(ed["historical_avg"], 2),
                    "difference": round(diff_dept, 2),
                    "status": outlier_status,
                    "reason": reason
                })

            # Fairness Analysis
            diff_desig = inc - desig_avg
            if abs(diff_desig) > threshold:
                fairness.append({
                    "employee_id": ed["employee_id"],
                    "name": ed["name"],
                    "department_name": ed["department_name"],
                    "designation": ed["designation"],
                    "current_increment": round(inc, 2),
                    "designation_avg": round(desig_avg, 2),
                    "difference": round(diff_desig, 2),
                    "status": "Needs Review",
                    "reason": f"Increment deviates by {abs(diff_desig):.1f}% from the {ed['designation']} average."
                })

        return {
            "outliers": outliers,
            "fairness_alerts": fairness,
            "summary": {
                "high_outliers": len([o for o in outliers if o["status"] == "High Outlier"]),
                "low_outliers": len([o for o in outliers if o["status"] == "Low Outlier"]),
                "fairness_alerts": len(fairness),
                "employees_reviewed": len([ed for ed in employee_data if (manager_id is None or ed["manager_id"] == manager_id)])
            }
        }
