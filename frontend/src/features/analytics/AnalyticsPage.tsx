import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { formatCurrency } from '../../utils/format';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Users, DollarSign, BarChart2 } from 'lucide-react';

const fetchAnalytics = async () => {
  const res = await api.get('/analytics');
  return res.data;
};

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#64748b', '#8b5cf6'];

export const AnalyticsPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['payroll-analytics'],
    queryFn: fetchAnalytics,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-xs font-medium text-slate-500">Loading analytics data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
        <h3 className="text-sm font-semibold text-red-800">Error loading analytics</h3>
        <p className="text-xs text-red-600 mt-1">Please ensure your backend server is running.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { summary, yoy_trend, dept_breakdown, salary_bands, increment_distribution } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Payroll Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Year-over-year payroll trends, department distributions, and compensation band analysis.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md"><Users size={14} /></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Employees</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{summary.total_employees}</span>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-slate-50 text-slate-500 rounded-md"><DollarSign size={14} /></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current Payroll</span>
          </div>
          <span className="text-xl font-bold text-slate-900">{formatCurrency(summary.current_payroll)}</span>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md"><TrendingUp size={14} /></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Projected Payroll</span>
          </div>
          <span className="text-xl font-bold text-emerald-700">{formatCurrency(summary.projected_payroll)}</span>
        </div>

        <div className="rounded-xl border border-indigo-600 bg-indigo-900 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-indigo-800 text-indigo-300 rounded-md"><BarChart2 size={14} /></div>
            <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Budget Growth</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">+{formatCurrency(summary.payroll_growth)}</span>
            <span className="text-xs font-bold text-emerald-400">+{summary.growth_pct}%</span>
          </div>
        </div>
      </div>

      {/* YoY Trend Line Chart */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Year-over-Year Payroll Trend</h2>
        <p className="text-xs text-slate-400 mb-4">Total organisational payroll across financial years</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={yoy_trend} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(val), 'Total CTC']}
                contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line
                type="monotone"
                dataKey="total_ctc"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#4f46e5', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dept Breakdown + Salary Bands Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Dept Bar Chart */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-1">Department Payroll Growth</h2>
          <p className="text-xs text-slate-400 mb-4">Current vs projected CTC by department</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dept_breakdown} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
                <YAxis type="category" dataKey="department_name" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} width={90} />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), '']}
                  contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="current_payroll" name="Current" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={10} />
                <Bar dataKey="projected_payroll" name="Projected" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Bands + Increment Dist */}
        <div className="space-y-6">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Salary Band Distribution</h2>
            <p className="text-xs text-slate-400 mb-4">Headcount by annual CTC range</p>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salary_bands} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="band" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip
                    formatter={(val: any) => [val, 'Employees']}
                    contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-1">Increment % Distribution</h2>
            <p className="text-xs text-slate-400 mb-3">Fixed increment ranges across the org</p>
            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={increment_distribution}
                    dataKey="count"
                    nameKey="range"
                    cx="40%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {increment_distribution.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => [val, 'Employees']} contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Dept table */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900">Department Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3 text-center">Headcount</th>
                <th className="px-5 py-3 text-right">Current Payroll</th>
                <th className="px-5 py-3 text-right">Projected Payroll</th>
                <th className="px-5 py-3 text-right">Budget Growth</th>
                <th className="px-5 py-3 text-right">Growth %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dept_breakdown.map((d: any) => (
                <tr key={d.department_name} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-slate-900">{d.department_name}</td>
                  <td className="px-5 py-3 text-center text-slate-600">{d.employee_count}</td>
                  <td className="px-5 py-3 text-right text-slate-600">{formatCurrency(d.current_payroll)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-slate-900">{formatCurrency(d.projected_payroll)}</td>
                  <td className="px-5 py-3 text-right font-bold text-emerald-600">+{formatCurrency(d.growth)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md px-2 py-0.5 text-[10px] font-bold">
                      +{d.growth_pct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
