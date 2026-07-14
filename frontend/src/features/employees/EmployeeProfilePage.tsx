import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { employeeService } from '../../services/employees';
import { formatCurrency } from '../../utils/format';
import { ArrowLeft, Briefcase, Calendar, ShieldCheck, TrendingUp, Wallet } from 'lucide-react';

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) return null;

  // 1. Fetch Profile Details
  const profileQuery = useQuery({
    queryKey: ['employee-detail', id],
    queryFn: () => employeeService.getEmployeeDetail(id),
  });

  // 2. Fetch Salary History
  const historyQuery = useQuery({
    queryKey: ['employee-history', id],
    queryFn: () => employeeService.getEmployeeHistory(id),
  });

  // 3. Fetch Current Salary Breakdown
  const currentSalaryQuery = useQuery({
    queryKey: ['employee-current-salary', id],
    queryFn: () => employeeService.getEmployeeCurrentSalary(id),
  });

  const isLoading =
    profileQuery.isLoading || historyQuery.isLoading || currentSalaryQuery.isLoading;
  const isError =
    profileQuery.isError || historyQuery.isError || currentSalaryQuery.isError;

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-xs text-slate-400">Loading employee workspace...</p>
      </div>
    );
  }

  if (isError || !profileQuery.data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
        <h3 className="text-sm font-semibold text-red-800">Error loading workspace profile</h3>
        <p className="text-xs text-red-600 mt-1">
          Make sure database server is active or that you have scope permissions to view this employee.
        </p>
        <button
          onClick={() => navigate('/employees')}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
        >
          Back to List
        </button>
      </div>
    );
  }

  const employee = profileQuery.data;
  const history = historyQuery.data || [];
  const current = currentSalaryQuery.data;

  // Prepare chart data sorting by financial year
  const chartData = [...history]
    .sort((a, b) => a.financial_year.localeCompare(b.financial_year))
    .map((item) => ({
      year: item.financial_year.replace('_', '-'),
      CTC: item.ctc,
    }));

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/employees')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Directory
      </button>

      {/* Profile Header */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 font-bold text-lg">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">{employee.name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Employee ID: <span className="font-mono text-slate-600 font-semibold">{employee.id}</span>
            </p>
          </div>
        </div>

        {/* Access control details */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
            <Briefcase size={12} className="text-slate-500" />
            {employee.current_designation}
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
            <Calendar size={12} className="text-slate-500" />
            DOJ: {new Date(employee.doj).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Compensation Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Salary Breakup */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Wallet className="text-indigo-600" size={16} />
              <h2 className="text-sm font-semibold text-slate-900">Current Base Components (FY 25-26)</h2>
            </div>

            {current ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Fixed Pay
                  </span>
                  <span className="mt-1 block text-sm font-bold text-slate-900">
                    {formatCurrency(current.fixed_pay)}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Variable Pay
                  </span>
                  <span className="mt-1 block text-sm font-bold text-slate-900">
                    {formatCurrency(current.variable_pay)}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Retention Bonus
                  </span>
                  <span className="mt-1 block text-sm font-bold text-slate-900">
                    {formatCurrency(current.retention_bonus)}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Mediclaim
                  </span>
                  <span className="mt-1 block text-sm font-bold text-slate-900">
                    {formatCurrency(current.mediclaim)}
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Gratuity
                  </span>
                  <span className="mt-1 block text-sm font-bold text-slate-900">
                    {formatCurrency(current.gratuity)}
                  </span>
                </div>
                <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
                  <span className="block text-[10px] text-indigo-600 font-bold uppercase tracking-wider">
                    Current CTC
                  </span>
                  <span className="mt-1 block text-sm font-extrabold text-indigo-900">
                    {formatCurrency(current.total_ctc)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No active compensation records found.</p>
            )}
          </div>

          {/* Historical salary chart */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <TrendingUp className="text-indigo-600" size={16} />
              <h2 className="text-sm font-semibold text-slate-900">Salary Growth Timeline (CTC Trends)</h2>
            </div>

            {chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `₹${val / 100000}L`}
                    />
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(val), 'CTC']}
                      contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="CTC"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center border border-dashed rounded-lg bg-slate-50 text-xs text-slate-400">
                No historical records present for this employee
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Reporting info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="text-indigo-600" size={16} />
              <h2 className="text-sm font-semibold text-slate-900">Reporting & Context</h2>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Department</span>
                <span className="mt-1 block font-semibold text-slate-900">{employee.department.name}</span>
              </div>
              
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Historical Avg Increment</span>
                <span className="mt-1 block font-semibold text-slate-900">
                  {employee.historical_average_increment !== null
                    ? `${employee.historical_average_increment.toFixed(2)}%`
                    : 'N/A'}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Direct Manager</span>
                <span className="mt-1 block font-semibold text-slate-900">
                  {employee.manager ? employee.manager.full_name : 'N/A'}
                </span>
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Employment Status</span>
                <span className="mt-1.5 inline-block rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 font-semibold text-slate-700">
                  {employee.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
