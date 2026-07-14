from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import Dict, Any, List
from app.models.employee import Employee
from app.models.current_salary import CurrentSalary
from app.models.projected_salary import ProjectedSalary
from app.models.salary_plan import SalaryPlan
from app.models.salary_history import SalaryHistory
from app.models.department import Department


class AnalyticsRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_payroll_analytics(self) -> Dict[str, Any]:
        """
        Aggregates comprehensive payroll analytics for the HR/Director view:
        - Year-over-year CTC trends (FY23, FY24, FY25, FY26 projected)
        - Department-wise headcount and payroll distribution
        - Salary band distribution (0-5L, 5-10L, 10-15L, 15-20L, 20L+)
        - Increment % distribution across the org
        """
        # === 1. YoY Trend: Average CTC per financial year ===
        yoy_rows = self.db.query(
            SalaryHistory.financial_year,
            func.sum(SalaryHistory.ctc).label("total_ctc"),
            func.count(SalaryHistory.employee_id).label("count")
        ).group_by(SalaryHistory.financial_year).order_by(SalaryHistory.financial_year).all()

        # Current year (FY25-26) total
        current_total = self.db.query(
            func.sum(
                CurrentSalary.fixed_pay + CurrentSalary.variable_pay +
                CurrentSalary.mediclaim + CurrentSalary.gratuity + CurrentSalary.retention_bonus
            )
        ).scalar() or 0

        # Projected year (FY26-27) total
        projected_total = self.db.query(
            func.sum(ProjectedSalary.projected_ctc)
        ).scalar() or 0

        yoy_trend = []
        fy_label_map = {"2022_23": "FY22-23", "2023_24": "FY23-24", "2024_25": "FY24-25"}
        for row in yoy_rows:
            yoy_trend.append({
                "year": fy_label_map.get(row.financial_year, row.financial_year),
                "total_ctc": float(row.total_ctc or 0),
                "employee_count": row.count,
                "avg_ctc": float(row.total_ctc or 0) / row.count if row.count else 0
            })
        # Append current & projected
        emp_count = self.db.query(Employee).filter(Employee.status == "Active").count()
        yoy_trend.append({
            "year": "FY25-26",
            "total_ctc": float(current_total),
            "employee_count": emp_count,
            "avg_ctc": float(current_total) / emp_count if emp_count else 0
        })
        yoy_trend.append({
            "year": "FY26-27 (Proj)",
            "total_ctc": float(projected_total),
            "employee_count": emp_count,
            "avg_ctc": float(projected_total) / emp_count if emp_count else 0
        })

        # === 2. Department-wise Payroll Share ===
        dept_rows = self.db.query(
            Department.name.label("department_name"),
            func.count(Employee.id).label("employee_count"),
            func.sum(
                CurrentSalary.fixed_pay + CurrentSalary.variable_pay +
                CurrentSalary.mediclaim + CurrentSalary.gratuity + CurrentSalary.retention_bonus
            ).label("current_payroll"),
            func.sum(ProjectedSalary.projected_ctc).label("projected_payroll"),
        ).select_from(Employee)\
         .join(Department, Department.id == Employee.department_id)\
         .outerjoin(CurrentSalary, CurrentSalary.employee_id == Employee.id)\
         .outerjoin(ProjectedSalary, ProjectedSalary.employee_id == Employee.id)\
         .filter(Employee.status == "Active")\
         .group_by(Department.name).all()

        dept_breakdown = []
        for r in dept_rows:
            cur = float(r.current_payroll or 0)
            proj = float(r.projected_payroll or cur)
            dept_breakdown.append({
                "department_name": r.department_name,
                "employee_count": r.employee_count,
                "current_payroll": cur,
                "projected_payroll": proj,
                "growth": proj - cur,
                "growth_pct": round(((proj - cur) / cur * 100) if cur > 0 else 0, 2)
            })

        # === 3. Salary Band Distribution (by total current CTC) ===
        salary_rows = self.db.query(
            Employee.id,
            (
                CurrentSalary.fixed_pay + CurrentSalary.variable_pay +
                CurrentSalary.mediclaim + CurrentSalary.gratuity + CurrentSalary.retention_bonus
            ).label("total_ctc")
        ).join(CurrentSalary, CurrentSalary.employee_id == Employee.id)\
         .filter(Employee.status == "Active").all()

        bands = {"< 5L": 0, "5-10L": 0, "10-15L": 0, "15-20L": 0, "20L+": 0}
        for row in salary_rows:
            ctc = float(row.total_ctc or 0)
            if ctc < 500000:
                bands["< 5L"] += 1
            elif ctc < 1000000:
                bands["5-10L"] += 1
            elif ctc < 1500000:
                bands["10-15L"] += 1
            elif ctc < 2000000:
                bands["15-20L"] += 1
            else:
                bands["20L+"] += 1

        salary_bands = [{"band": k, "count": v} for k, v in bands.items() if v > 0]

        # === 4. Increment % Distribution ===
        inc_rows = self.db.query(SalaryPlan.increment_pct_fixed).all()
        inc_buckets = {"0%": 0, "1-5%": 0, "6-10%": 0, "11-15%": 0, "15%+": 0}
        for (pct,) in inc_rows:
            p = float(pct or 0)
            if p == 0:
                inc_buckets["0%"] += 1
            elif p <= 5:
                inc_buckets["1-5%"] += 1
            elif p <= 10:
                inc_buckets["6-10%"] += 1
            elif p <= 15:
                inc_buckets["11-15%"] += 1
            else:
                inc_buckets["15%+"] += 1

        increment_distribution = [{"range": k, "count": v} for k, v in inc_buckets.items() if v > 0]

        return {
            "yoy_trend": yoy_trend,
            "dept_breakdown": dept_breakdown,
            "salary_bands": salary_bands,
            "increment_distribution": increment_distribution,
            "summary": {
                "total_employees": emp_count,
                "current_payroll": float(current_total),
                "projected_payroll": float(projected_total),
                "payroll_growth": float(projected_total - current_total),
                "growth_pct": round(float((projected_total - current_total) / current_total * 100) if current_total > 0 else 0, 2)
            }
        }
