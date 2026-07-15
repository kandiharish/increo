import { api } from './api';

export interface EmployeeListItem {
  id: string;
  name: string;
  department_name: string;
  manager_name?: string;
  current_designation: string;
  proposed_designation?: string;
  current_ctc: number;
  projected_ctc: number;
  planning_status: string;
  historical_average_increment: string | number | null;
}

export interface PaginatedEmployees {
  items: EmployeeListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface Department {
  id: number;
  name: string;
}

export interface Manager {
  id: number;
  full_name: string;
}

export interface EmployeeDetail {
  id: string;
  name: string;
  doj: string;
  current_designation: string;
  proposed_designation?: string;
  status: string;
  department: Department;
  manager?: Manager;
  historical_average_increment: string | number | null;
}

export interface SalaryHistoryItem {
  financial_year: string;
  ctc: number;
}

export interface CurrentSalaryBreakdown {
  fixed_pay: number;
  variable_pay: number;
  mediclaim: number;
  gratuity: number;
  retention_bonus: number;
  total_ctc: number;
}

export interface ProjectedSalaryBreakdown {
  fixed_pay: number;
  variable_pay: number;
  mediclaim: number;
  gratuity: number;
  retention_bonus: number;
  projected_ctc: number;
}

export const employeeService = {
  async getEmployees(params: {
    page: number;
    limit: number;
    search?: string;
    departmentId?: number;
    designation?: string;
  }): Promise<PaginatedEmployees> {
    const response = await api.get<PaginatedEmployees>('/employees', {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search || undefined,
        department_id: params.departmentId || undefined,
        designation: params.designation || undefined,
      },
    });
    return response.data;
  },

  async getEmployeeDetail(id: string): Promise<EmployeeDetail> {
    const response = await api.get<EmployeeDetail>(`/employees/${id}`);
    return response.data;
  },

  async getEmployeeHistory(id: string): Promise<SalaryHistoryItem[]> {
    const response = await api.get<SalaryHistoryItem[]>(`/employees/${id}/salary-history`);
    return response.data;
  },

  async getEmployeeCurrentSalary(id: string): Promise<CurrentSalaryBreakdown> {
    const response = await api.get<CurrentSalaryBreakdown>(`/employees/${id}/current-salary`);
    return response.data;
  },

  async getEmployeeProjection(id: string): Promise<ProjectedSalaryBreakdown> {
    const response = await api.get<ProjectedSalaryBreakdown>(`/employees/${id}/projection`);
    return response.data;
  },

  async savePlanning(payload: {
    employee_id: string;
    increment_pct_fixed: number;
    increment_pct_variable: number;
    increment_pct_retention: number;
  }): Promise<{ success: boolean; message: string; projected_ctc: number }> {
    const response = await api.post('/planning/save', payload);
    return response.data;
  },

  async submitPlanning(payload: {
    employee_id: string;
    increment_pct_fixed: number;
    increment_pct_variable: number;
    increment_pct_retention: number;
  }): Promise<{ success: boolean; message: string; projected_ctc: number }> {
    const response = await api.post('/planning/submit', payload);
    return response.data;
  },
};
