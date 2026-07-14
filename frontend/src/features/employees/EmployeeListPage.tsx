import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usePlanning } from '../../contexts/PlanningContext';
import { employeeService } from '../../services/employees';
import { formatCurrency } from '../../utils/format';
import { SlidersHorizontal, UserCheck, X, Eye, Calculator, History, Search } from 'lucide-react';

export const EmployeeListPage: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = usePlanning();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Filters state
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [designation, setDesignation] = useState<string>('');
  const [planningStatus, setPlanningStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Reset to page 1 if query or backend-filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, departmentId, designation]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['employees', page, limit, searchQuery, departmentId, designation],
    queryFn: () =>
      employeeService.getEmployees({
        page,
        limit,
        search: searchQuery,
        departmentId,
        designation,
      }),
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'In Progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Not Started':
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const handleResetFilters = () => {
    setDepartmentId(undefined);
    setDesignation('');
    setPlanningStatus('');
  };

  // Client-side filter for planning status (to avoid modifying backend API)
  const displayedItems = data?.items.filter((emp) => {
    if (planningStatus && emp.planning_status !== planningStatus) return false;
    return true;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Employee Workspace</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review compensation history and prepare upcoming financial year salary increments.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#cbd5e1] bg-white py-1.5 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none shadow-sm"
              placeholder="Search ID or Name..."
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
              showFilters || departmentId || designation || planningStatus
                ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                : 'border-[#cbd5e1] bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={14} />
            {showFilters ? 'Hide Filters' : 'Filters'}
            {(departmentId || designation || planningStatus) && (
              <span className="ml-1 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] text-white">
                {(departmentId ? 1 : 0) + (designation ? 1 : 0) + (planningStatus ? 1 : 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Options Drawer */}
      {showFilters && (
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-semibold text-slate-800">Advanced Filters</span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <X size={12} /> Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Department
              </label>
              <select
                value={departmentId || ''}
                onChange={(e) => setDepartmentId(e.target.value ? Number(e.target.value) : undefined)}
                className="mt-1.5 block w-full rounded-md border border-[#cbd5e1] bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
              >
                <option value="">All Departments</option>
                <option value="1">Engineering</option>
                <option value="2">Human Resources</option>
                <option value="3">Finance</option>
                <option value="4">Operations</option>
                <option value="5">Sales</option>
                <option value="6">Marketing</option>
                <option value="7">Information Technology</option>
                <option value="8">Legal</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Lead, Senior, Consultant"
                className="mt-1.5 block w-full rounded-md border border-[#cbd5e1] bg-slate-50 px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Planning Status
              </label>
              <select
                value={planningStatus}
                onChange={(e) => setPlanningStatus(e.target.value)}
                className="mt-1.5 block w-full rounded-md border border-[#cbd5e1] bg-slate-50 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-sm flex flex-col min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-slate-50/50">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="text-xs font-medium text-slate-400">Loading directory items...</p>
          </div>
        ) : error ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-red-50/30">
            <p className="text-sm font-semibold text-red-600">Failed to load directory</p>
            <p className="text-xs text-slate-500 mt-1">Please make sure the backend server is running.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-slate-50/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-400">
              <UserCheck size={20} />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">No records found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your filters or search keywords.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-[#cbd5e1] bg-slate-50 font-semibold text-slate-500 uppercase tracking-wider text-[10px] shadow-sm">
                    <th className="px-5 py-3">Employee ID</th>
                    <th className="px-5 py-3">Full Name</th>
                    <th className="px-5 py-3">Department</th>
                    <th className="px-5 py-3">Reporting Manager</th>
                    <th className="px-5 py-3">Designation</th>
                    <th className="px-5 py-3 text-right">Current CTC</th>
                    <th className="px-5 py-3 text-right">Projected CTC</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] text-slate-700 bg-white">
                  {displayedItems.map((emp) => (
                    <tr
                      key={emp.id}
                      className="group hover:bg-indigo-50/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono font-medium text-slate-500">
                        {emp.id}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{emp.name}</td>
                      <td className="px-5 py-3.5 text-slate-600">{emp.department_name}</td>
                      <td className="px-5 py-3.5 text-slate-500">{emp.manager_name || '—'}</td>
                      <td className="px-5 py-3.5 text-slate-600">{emp.current_designation}</td>
                      <td className="px-5 py-3.5 text-right font-medium text-slate-700">{formatCurrency(emp.current_ctc)}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-indigo-900">
                        {emp.projected_ctc > 0 ? formatCurrency(emp.projected_ctc) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <span
                          className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${getStatusBadgeStyle(
                            emp.planning_status
                          )}`}
                        >
                          {emp.planning_status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/employees/${emp.id}`)}
                            title="View Profile Details"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => navigate(`/employees/${emp.id}`)}
                            title="Salary History"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          >
                            <History size={14} />
                          </button>
                          <button
                            onClick={() => navigate('/planning')}
                            title="Plan Increment"
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <Calculator size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-[#cbd5e1] bg-slate-50 px-6 py-3">
              <span className="text-[11px] font-medium text-slate-500">
                Showing <span className="font-bold text-slate-900">{(page - 1) * limit + 1}</span> to <span className="font-bold text-slate-900">{Math.min(page * limit, data?.total || 0)}</span> of <span className="font-bold text-slate-900">{data?.total || 0}</span> employees
              </span>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="rounded-md border border-[#cbd5e1] bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                  Previous
                </button>
                <button
                  disabled={page * limit >= (data?.total || 0)}
                  onClick={() => setPage(page + 1)}
                  className="rounded-md border border-[#cbd5e1] bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
