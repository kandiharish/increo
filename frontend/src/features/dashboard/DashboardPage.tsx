import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard';
import { formatCurrency } from '../../utils/format';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

const PIE_COLORS = ['#10b981', '#f59e0b', '#64748b'];

export const DashboardPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardService.getDashboardSummary(),
  });

  const insights = useMemo(() => {
    if (!data || data.departments.length === 0) return [];
    
    const depts = [...data.departments];
    
    // Sort by highest increment variance
    const highestGrowthDept = depts.sort((a, b) => (b.projected_payroll - b.current_payroll) - (a.projected_payroll - a.current_payroll))[0];
    const highestGrowthPct = ((highestGrowthDept.projected_payroll - highestGrowthDept.current_payroll) / (highestGrowthDept.current_payroll || 1)) * 100;
    
    // Sort by headcount
    const largestDept = [...depts].sort((a, b) => b.employee_count - a.employee_count)[0];
    
    const messages = [];
    
    if (highestGrowthDept && (highestGrowthDept.projected_payroll - highestGrowthDept.current_payroll) > 0) {
      messages.push({
        title: 'Highest Budget Impact',
        text: `${highestGrowthDept.department_name} department is driving the highest budget variance with an overall ${highestGrowthPct.toFixed(1)}% increase.`,
        type: 'warning',
      });
    }

    if (data.kpis.completion_rate < 100) {
      messages.push({
        title: 'Planning Cycle Incomplete',
        text: `There are ${data.kpis.inprogress_count + data.kpis.notstarted_count} appraisals still pending submission.`,
        type: 'info',
      });
    } else if (data.kpis.total_employees > 0) {
      messages.push({
        title: 'Planning Complete',
        text: 'All appraisals have been successfully submitted for the current cycle.',
        type: 'success',
      });
    }

    messages.push({
      title: 'Largest Department',
      text: `${largestDept.department_name} is currently your largest department with ${largestDept.employee_count} FTEs.`,
      type: 'neutral',
    });

    return messages;
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        <p className="text-xs text-slate-400">Loading dashboard data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
        <h3 className="text-sm font-semibold text-red-800">Error loading dashboard</h3>
        <p className="text-xs text-red-600 mt-1">Please ensure your backend server is running and database is seeded.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { kpis, departments, activities } = data;

  const pendingReviews = kpis.inprogress_count + kpis.notstarted_count;
  const employeesRemaining = kpis.total_employees - kpis.completed_count;

  // Prepare chart data for department comparison
  const deptChartData = departments.map((d) => ({
    name: d.department_name,
    Current: d.current_payroll,
    Projected: d.projected_payroll,
  }));

  const pieData = [
    { name: 'Completed', value: kpis.completed_count },
    { name: 'In Progress', value: kpis.inprogress_count },
    { name: 'Not Started', value: kpis.notstarted_count },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Real-time insights on payroll variance, budget projections, and increment statuses.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid - 6 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Pending Reviews */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Pending</span>
            <Clock size={16} className="text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{pendingReviews}</span>
          </div>
        </div>

        {/* Completed Reviews */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 size={16} className="text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{kpis.completed_count}</span>
          </div>
        </div>

        {/* Avg Increment % */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Avg Increment</span>
            <TrendingUp size={16} className="text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-700">+{kpis.payroll_growth_pct.toFixed(2)}%</span>
          </div>
        </div>

        {/* Budget Variance */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm hover:shadow-md transition-shadow col-span-1 md:col-span-3 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Budget Variance</span>
            <DollarSign size={16} className="text-indigo-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">+{formatCurrency(kpis.payroll_growth)}</span>
          </div>
        </div>

        {/* Employees Planned */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Planned (FTE)</span>
            <Users size={16} className="text-slate-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{kpis.completed_count}</span>
            <span className="text-[10px] text-slate-400 font-medium">/ {kpis.total_employees}</span>
          </div>
        </div>

        {/* Employees Remaining */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Remaining (FTE)</span>
            <AlertCircle size={16} className={employeesRemaining > 0 ? "text-amber-500" : "text-emerald-500"} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{employeesRemaining}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Department Comparison Bar Chart */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Payroll Budget Breakdown by Department</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val / 100000}L`}
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    formatter={(val: any) => [formatCurrency(val), 'Annual CTC']}
                    contentStyle={{ background: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Current" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="Projected" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Planning Status Pie Chart */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm flex flex-col justify-between">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">Increment Reviews Distribution</h2>
            <div className="h-48 w-full">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val: any) => [val, 'Employees']} 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  No planning records started
                </div>
              )}
            </div>
            
            {/* Custom legend */}
            <div className="grid grid-cols-3 text-center text-[11px] font-medium divide-x divide-slate-100 mt-2">
              <div>
                <span className="block text-emerald-600 text-xl font-bold">{kpis.completed_count}</span>
                <span className="text-slate-500">Completed</span>
              </div>
              <div>
                <span className="block text-amber-500 text-xl font-bold">{kpis.inprogress_count}</span>
                <span className="text-slate-500">In Progress</span>
              </div>
              <div>
                <span className="block text-slate-400 text-xl font-bold">{kpis.notstarted_count}</span>
                <span className="text-slate-500">Not Started</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Insights & Activity */}
        <div className="space-y-6">
          
          {/* Business Insights Panel */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#e2e8f0] bg-slate-50/50 px-5 py-3.5 flex items-center gap-2">
              <Lightbulb size={16} className="text-indigo-600" />
              <h2 className="text-sm font-semibold text-slate-900">Business Insights</h2>
            </div>
            <div className="p-5 space-y-4">
              {insights.map((insight, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    insight.type === 'warning' ? 'bg-amber-500' :
                    insight.type === 'success' ? 'bg-emerald-500' :
                    insight.type === 'info' ? 'bg-blue-500' : 'bg-slate-300'
                  }`} />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900">{insight.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Audit trail updates */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="border-b border-[#e2e8f0] bg-slate-50/50 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-indigo-600" />
                <h2 className="text-sm font-semibold text-slate-900">Recent Activity</h2>
              </div>
              <span className="text-[10px] font-medium text-slate-400">{activities.length} logs</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              {activities.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-xs text-slate-400 text-center">No recent activity logs found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div key={act.id} className="relative pl-4 border-l border-slate-100 pb-1">
                      <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-slate-200 border-2 border-white" />
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-semibold text-slate-900 text-xs">Increment Updated</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Emp ID: <span className="font-mono font-medium text-slate-700">{act.employee_id}</span>
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1.5 rounded bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-100">
                        <span>Fixed: +{act.new_values.increment_pct_fixed}%</span>
                        <span className="text-slate-300">|</span>
                        <span>Var: +{act.new_values.increment_pct_variable}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
