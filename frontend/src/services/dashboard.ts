import { api } from './api';

export interface DashboardKPIs {
  total_employees: number;
  current_payroll: number;
  projected_payroll: number;
  payroll_growth: number;
  payroll_growth_pct: number;
  completed_count: number;
  inprogress_count: number;
  notstarted_count: number;
  completion_rate: number;
}

export interface DepartmentBreakdown {
  department_name: string;
  employee_count: number;
  current_payroll: number;
  projected_payroll: number;
  avg_planned_increment: number;
}

export interface RecentActivity {
  id: number;
  employee_id: string;
  action: string;
  timestamp: string;
  new_values: any;
}

export interface DashboardSummary {
  kpis: DashboardKPIs;
  departments: DepartmentBreakdown[];
  activities: RecentActivity[];
}

export const dashboardService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await api.get<DashboardSummary>('/dashboard');
    return response.data;
  },
};
