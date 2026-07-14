import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePlanning } from '../../contexts/PlanningContext';
import type { FinancialYear } from '../../contexts/PlanningContext';
import { Search, CalendarDays } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { financialYear, setFinancialYear, searchQuery, setSearchQuery } = usePlanning();

  if (!user) return null;

  // Determine role styling for badge
  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Manager':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'HR':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Director':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#e2e8f0] bg-white px-8">
      {/* Search Input */}
      <div className="relative w-72">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[#cbd5e1] bg-slate-50 py-1.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none"
          placeholder="Search by Employee ID or Name..."
        />
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-6">
        {/* Financial Year Selector */}
        <div className="flex items-center gap-2 border border-[#cbd5e1] rounded-lg bg-slate-50 px-3 py-1">
          <CalendarDays size={14} className="text-slate-500" />
          <span className="text-[11px] font-medium text-slate-500 mr-1">Planning Cycle:</span>
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value as FinancialYear)}
            className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
          >
            <option value="2025_26">FY 2025-26 (Current)</option>
            <option value="2026_27">FY 2026-27 (Projected)</option>
          </select>
        </div>

        {/* User Info with Role Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-900">{user.full_name}</div>
          </div>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${getRoleBadgeStyle(
              user.role
            )}`}
          >
            {user.role}
          </span>
        </div>
      </div>
    </header>
  );
};
