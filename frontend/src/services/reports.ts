import { api } from './api';

export interface DepartmentPayrollSummary {
  department_name: string;
  employee_count: number;
  current_payroll: number;
  projected_payroll: number;
  payroll_growth: number;
  avg_planned_increment: number;
}

export interface IncrementReportRecord {
  employee_id: string;
  name: string;
  department_name: string;
  current_ctc: number;
  projected_ctc: number;
  difference: number;
  increment_pct_fixed: number;
  increment_pct_variable: number;
  increment_pct_retention: number;
  status: string;
}

export interface ReportsSummary {
  departments: DepartmentPayrollSummary[];
  records: IncrementReportRecord[];
}

export const reportsService = {
  async getReportsSummary(departmentId?: number): Promise<ReportsSummary> {
    const response = await api.get<ReportsSummary>('/reports', {
      params: {
        department_id: departmentId || undefined,
      },
    });
    return response.data;
  },
};
