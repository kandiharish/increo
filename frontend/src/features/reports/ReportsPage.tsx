import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../../services/reports';
import { departmentsService } from '../../services/departments';
import { formatCurrency } from '../../utils/format';
import { Download, Printer, FileText, TrendingUp, Users, DollarSign, Lightbulb, AlertTriangle, Scale } from 'lucide-react';
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

const PIE_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#64748b'];

export const ReportsPage: React.FC = () => {
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [outlierThreshold, setOutlierThreshold] = useState<number>(5.0);

  // Fetch reports data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['reports-summary', departmentId],
    queryFn: () => reportsService.getReportsSummary(departmentId),
  });

  const { data: analysisData, isLoading: analysisLoading } = useQuery({
    queryKey: ['reports-analysis', outlierThreshold],
    queryFn: () => reportsService.getAnalysis(outlierThreshold),
  });

  // Fetch departments data
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentsService.getDepartments(),
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!data || data.records.length === 0) return;

    const headers = [
      'Employee ID',
      'Name',
      'Department',
      'Current CTC (Annual)',
      'Projected CTC (Annual)',
      'Increment Variance',
      'Fixed Increment %',
      'Variable Increment %',
      'Retention Increment %',
      'Planning Status',
    ];

    const rows = data.records.map((r) => [
      r.employee_id,
      r.name,
      r.department_name,
      r.current_ctc,
      r.projected_ctc,
      r.difference,
      r.increment_pct_fixed,
      r.increment_pct_variable,
      r.increment_pct_retention,
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `increo_increment_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportOutliers = () => {
    if (!analysisData || analysisData.outliers.length === 0) return;
    const headers = ['Employee ID', 'Name', 'Department', 'Increment %', 'Dept Avg %', 'Hist Avg %', 'Difference', 'Status', 'Reason'];
    const rows = analysisData.outliers.map(o => [o.employee_id, o.name, o.department_name, o.current_increment, o.department_avg, o.historical_avg, o.difference, o.status, `"${o.reason}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `increo_outliers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleExportFairness = () => {
    if (!analysisData || analysisData.fairness_alerts.length === 0) return;
    const headers = ['Employee ID', 'Name', 'Department', 'Designation', 'Increment %', 'Desig Avg %', 'Difference', 'Status', 'Reason'];
    const rows = analysisData.fairness_alerts.map(o => [o.employee_id, o.name, o.department_name, o.designation, o.current_increment, o.designation_avg, o.difference, o.status, `"${o.reason}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `increo_fairness_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Derive BI metrics
  const biData = useMemo(() => {
    if (!data) return null;

    const totalCurrent = data.departments.reduce((acc, d) => acc + d.current_payroll, 0);
    const totalProjected = data.departments.reduce((acc, d) => acc + d.projected_payroll, 0);
    const totalVariance = totalProjected - totalCurrent;
    const avgGrowth = totalCurrent > 0 ? (totalVariance / totalCurrent) * 100 : 0;
    const totalEmployees = data.departments.reduce((acc, d) => acc + d.employee_count, 0);

    // Chart 1: Payroll Trend by Dept
    const deptTrendData = data.departments.map(d => ({
      name: d.department_name,
      Current: d.current_payroll,
      Projected: d.projected_payroll,
      AvgPlannedInc: d.avg_planned_increment
    }));

    // Chart 2: Increment Distribution (Count of employees by fixed pct ranges)
    const distMap: Record<string, number> = {
      '0%': 0,
      '1-5%': 0,
      '6-10%': 0,
      '11-15%': 0,
      '15%+': 0,
    };

    data.records.forEach(r => {
      const p = r.increment_pct_fixed;
      if (p === 0) distMap['0%']++;
      else if (p <= 5) distMap['1-5%']++;
      else if (p <= 10) distMap['6-10%']++;
      else if (p <= 15) distMap['11-15%']++;
      else distMap['15%+']++;
    });

    const distData = Object.keys(distMap).map(k => ({ name: k, value: distMap[k] })).filter(d => d.value > 0);

    // Insights Generation
    const insights = [];
    if (totalVariance > 0) {
      insights.push(`The total budget impact for the selected scope is ${formatCurrency(totalVariance)}, representing an average increase of ${avgGrowth.toFixed(1)}%.`);
    } else {
      insights.push('No significant budget impact has been modeled yet.');
    }

    const maxDept = [...data.departments].sort((a, b) => b.payroll_growth - a.payroll_growth)[0];
    if (maxDept && maxDept.payroll_growth > 0) {
      insights.push(`${maxDept.department_name} shows the highest projected budget growth at ${formatCurrency(maxDept.payroll_growth)}.`);
    }

    return {
      totalCurrent,
      totalProjected,
      totalVariance,
      avgGrowth,
      totalEmployees,
      deptTrendData,
      distData,
      insights
    };
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Analyze appraisal summary metrics and export detailed records.
          </p>
        </div>

        {/* Global Export Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Printer size={14} /> Export PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm flex items-center gap-4 no-print">
        <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">Report Scope:</span>
        <select
          value={departmentId || ''}
          onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
          className="block w-64 rounded-md border border-[#cbd5e1] bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
        >
          <option value="">All Departments</option>
          {departments?.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 bg-slate-50/50 rounded-xl border border-slate-200">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">Compiling report analytics...</p>
        </div>
      ) : error ? (
        <div className="flex h-64 flex-col items-center justify-center p-6 text-center bg-red-50/50 rounded-xl border border-red-100">
          <p className="text-sm font-bold text-red-600">Failed to load reports summary</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
          >
            Retry Connection
          </button>
        </div>
      ) : !data || !biData ? (
        <div className="flex h-64 flex-col items-center justify-center p-6 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-slate-100">
            <FileText size={20} />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-900">No report records found</h3>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Section 1: KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 no-print">
            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md"><DollarSign size={14} /></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current Payroll</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{formatCurrency(biData.totalCurrent)}</span>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md"><TrendingUp size={14} /></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Projected Payroll</span>
              </div>
              <span className="text-xl font-bold text-emerald-700">{formatCurrency(biData.totalProjected)}</span>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-amber-50 text-amber-600 rounded-md"><FileText size={14} /></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Avg Growth</span>
              </div>
              <span className="text-xl font-bold text-slate-900">+{biData.avgGrowth.toFixed(2)}%</span>
            </div>

            <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md"><Users size={14} /></div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Headcount</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{biData.totalEmployees} FTEs</span>
            </div>
          </div>

          {/* Section 2: Charts & Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
            
            {/* Payroll Trend Bar Chart */}
            <div className="lg:col-span-2 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Department Payroll Trends</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={biData.deptTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 100000}L`} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(val: any) => [formatCurrency(val), 'CTC']} contentStyle={{ borderRadius: '8px', fontSize: '11px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="Current" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="Projected" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="lg:col-span-3 rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Department Summary</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#cbd5e1] bg-slate-50 font-semibold text-slate-500 uppercase tracking-wider text-[9px]">
                      <th className="px-5 py-3">Department</th>
                      <th className="px-5 py-3 text-right">Headcount</th>
                      <th className="px-5 py-3 text-right">Current Payroll</th>
                      <th className="px-5 py-3 text-right">Projected Payroll</th>
                      <th className="px-5 py-3 text-right">Variance</th>
                      <th className="px-5 py-3 text-center text-indigo-600 font-bold">Avg Planned Inc.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] text-slate-700">
                    {data.departments.map((dept, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-semibold text-slate-900">{dept.department_name}</td>
                        <td className="px-5 py-3 text-right">{dept.employee_count}</td>
                        <td className="px-5 py-3 text-right">{formatCurrency(dept.current_payroll)}</td>
                        <td className="px-5 py-3 text-right font-medium text-slate-900">{formatCurrency(dept.projected_payroll)}</td>
                        <td className="px-5 py-3 text-right text-emerald-600 font-medium">+{formatCurrency(dept.payroll_growth)}</td>
                        <td className="px-5 py-3 text-center text-indigo-600 font-bold">{(dept.avg_planned_increment || 0).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dist & Insights Column */}
            <div className="space-y-6">
              <div className="rounded-xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">Increment Distribution (Fixed)</h2>
                <div className="h-40 w-full">
                  {biData.distData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={biData.distData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {biData.distData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: any) => [val, 'Employees']} contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-400">No planning data</div>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={16} className="text-indigo-600" />
                  <h3 className="text-sm font-bold text-indigo-900">Summary Insights</h3>
                </div>
                <ul className="space-y-2 text-xs text-indigo-800 font-medium">
                  {biData.insights.map((insight, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Table */}
          <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden print-border">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Detailed Increment Ledger</h2>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{data.records.length} Records Exportable</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#cbd5e1] bg-slate-50 font-semibold text-slate-500 uppercase tracking-wider text-[9px]">
                    <th className="px-5 py-3">Employee</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3 text-right">Current CTC</th>
                    <th className="px-5 py-3 text-right">Projected CTC</th>
                    <th className="px-5 py-3 text-right">Variance</th>
                    <th className="px-5 py-3 text-center">Fixed %</th>
                    <th className="px-5 py-3 text-center">Variable %</th>
                    <th className="px-5 py-3 text-center">Retention %</th>
                    <th className="px-5 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-slate-700 bg-white">
                  {data.records.map((rec) => (
                    <tr key={rec.employee_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-900 block">{rec.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{rec.employee_id}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{rec.department_name}</td>
                      <td className="px-5 py-3.5 text-right font-medium text-slate-600">{formatCurrency(rec.current_ctc)}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-slate-900">{formatCurrency(rec.projected_ctc)}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-emerald-600">
                        +{formatCurrency(rec.difference)}
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono text-slate-600">{rec.increment_pct_fixed.toFixed(1)}%</td>
                      <td className="px-5 py-3.5 text-center font-mono text-slate-600">{rec.increment_pct_variable.toFixed(1)}%</td>
                      <td className="px-5 py-3.5 text-center font-mono text-slate-600">{rec.increment_pct_retention.toFixed(1)}%</td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            rec.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : rec.status === 'In Progress'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Section 4: Outlier & Fairness Analysis */}
          {analysisData && (
            <>
              <div className="flex items-center justify-between pt-8 pb-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Analysis & Integrity</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Deviation Threshold:</span>
                  <input 
                    type="number" 
                    value={outlierThreshold}
                    onChange={(e) => setOutlierThreshold(Number(e.target.value) || 5.0)}
                    className="w-16 rounded border border-[#cbd5e1] px-2 py-1 text-xs text-center focus:border-indigo-600 focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-slate-600">%</span>
                </div>
              </div>

              {/* Analysis Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 no-print">
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-red-100 text-red-600 rounded-md"><TrendingUp size={14} /></div>
                    <span className="text-[10px] text-red-700 font-bold uppercase tracking-wider">High Outliers</span>
                  </div>
                  <span className="text-xl font-bold text-red-800">{analysisData.summary.high_outliers}</span>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-100 text-blue-600 rounded-md"><TrendingUp size={14} className="rotate-180" /></div>
                    <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Low Outliers</span>
                  </div>
                  <span className="text-xl font-bold text-blue-800">{analysisData.summary.low_outliers}</span>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-amber-100 text-amber-600 rounded-md"><Scale size={14} /></div>
                    <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Fairness Alerts</span>
                  </div>
                  <span className="text-xl font-bold text-amber-800">{analysisData.summary.fairness_alerts}</span>
                </div>
                <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-slate-100 text-slate-600 rounded-md"><Users size={14} /></div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Employees Reviewed</span>
                  </div>
                  <span className="text-xl font-bold text-slate-900">{analysisData.summary.employees_reviewed}</span>
                </div>
              </div>

              {/* Outlier Analysis Table */}
              <div className="rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden print-border mt-6">
                <div className="px-6 py-4 border-b border-red-100 bg-red-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-500" />
                    <h2 className="text-sm font-bold text-slate-900">Outlier Analysis</h2>
                  </div>
                  <button onClick={handleExportOutliers} className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-wider">
                    <Download size={12} /> Export Outliers
                  </button>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-10">
                      <tr className="border-b border-[#cbd5e1] font-semibold text-slate-500 uppercase tracking-wider text-[9px]">
                        <th className="px-5 py-3">Employee</th>
                        <th className="px-5 py-3">Department</th>
                        <th className="px-5 py-3 text-center">Inc %</th>
                        <th className="px-5 py-3 text-center">Dept Avg %</th>
                        <th className="px-5 py-3 text-center">Hist Avg %</th>
                        <th className="px-5 py-3 text-center">Difference</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 min-w-[200px]">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] text-slate-700">
                      {analysisData.outliers.length === 0 ? (
                        <tr><td colSpan={8} className="px-5 py-8 text-center text-slate-400">No outliers detected within {outlierThreshold}% threshold.</td></tr>
                      ) : (
                        analysisData.outliers.map((rec) => (
                          <tr key={rec.employee_id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-3">
                              <span className="font-semibold text-slate-900 block">{rec.name}</span>
                              <span className="font-mono text-[10px] text-slate-400">{rec.employee_id}</span>
                            </td>
                            <td className="px-5 py-3 text-slate-500">{rec.department_name}</td>
                            <td className="px-5 py-3 text-center font-bold text-slate-900">{rec.current_increment.toFixed(1)}%</td>
                            <td className="px-5 py-3 text-center font-mono text-slate-500">{rec.department_avg.toFixed(1)}%</td>
                            <td className="px-5 py-3 text-center font-mono text-slate-500">{rec.historical_avg > 0 ? rec.historical_avg.toFixed(1) + '%' : '-'}</td>
                            <td className={`px-5 py-3 text-center font-bold ${rec.difference > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                              {rec.difference > 0 ? '+' : ''}{rec.difference.toFixed(1)}%
                            </td>
                            <td className="px-5 py-3">
                              <span className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                rec.status === 'High Outlier' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>{rec.status}</span>
                            </td>
                            <td className="px-5 py-3 text-slate-500 text-[10px]">{rec.reason}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fairness Analysis Table */}
              <div className="rounded-xl border border-amber-200 bg-white shadow-sm overflow-hidden print-border mt-6 mb-8">
                <div className="px-6 py-4 border-b border-amber-100 bg-amber-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale size={16} className="text-amber-600" />
                    <h2 className="text-sm font-bold text-slate-900">Fairness Analysis</h2>
                  </div>
                  <button onClick={handleExportFairness} className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-wider">
                    <Download size={12} /> Export Fairness
                  </button>
                </div>
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] z-10">
                      <tr className="border-b border-[#cbd5e1] font-semibold text-slate-500 uppercase tracking-wider text-[9px]">
                        <th className="px-5 py-3">Employee</th>
                        <th className="px-5 py-3">Department</th>
                        <th className="px-5 py-3">Designation</th>
                        <th className="px-5 py-3 text-center">Inc %</th>
                        <th className="px-5 py-3 text-center">Role Avg %</th>
                        <th className="px-5 py-3 text-center">Difference</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 min-w-[200px]">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] text-slate-700">
                      {analysisData.fairness_alerts.length === 0 ? (
                        <tr><td colSpan={8} className="px-5 py-8 text-center text-slate-400">No fairness alerts detected within {outlierThreshold}% threshold.</td></tr>
                      ) : (
                        analysisData.fairness_alerts.map((rec) => (
                          <tr key={rec.employee_id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-3">
                              <span className="font-semibold text-slate-900 block">{rec.name}</span>
                              <span className="font-mono text-[10px] text-slate-400">{rec.employee_id}</span>
                            </td>
                            <td className="px-5 py-3 text-slate-500">{rec.department_name}</td>
                            <td className="px-5 py-3 text-slate-600 font-medium">{rec.designation}</td>
                            <td className="px-5 py-3 text-center font-bold text-slate-900">{rec.current_increment.toFixed(1)}%</td>
                            <td className="px-5 py-3 text-center font-mono text-slate-500">{rec.designation_avg.toFixed(1)}%</td>
                            <td className={`px-5 py-3 text-center font-bold text-amber-600`}>
                              {rec.difference > 0 ? '+' : ''}{rec.difference.toFixed(1)}%
                            </td>
                            <td className="px-5 py-3">
                              <span className="inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-200">
                                {rec.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-slate-500 text-[10px]">{rec.reason}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
};
