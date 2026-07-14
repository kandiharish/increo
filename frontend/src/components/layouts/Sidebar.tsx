import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calculator,
  FileText,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!user) return null;

  // Filter routes based on user role permissions
  const getNavigationLinks = () => {
    const role = user.role;
    const links = [
      {
        path: '/',
        label: 'Dashboard',
        icon: LayoutDashboard,
        roles: ['Manager', 'HR', 'Director'],
      },
      {
        path: '/employees',
        label: role === 'Manager' ? 'My Team' : 'Employees',
        icon: Users,
        roles: ['Manager', 'HR', 'Director'],
      },
      {
        path: '/planning',
        label: 'Appraisal Planning',
        icon: Calculator,
        roles: ['Manager', 'HR'], // Read-only for HR, edit for Manager
      },
      {
        path: '/reports',
        label: 'Reports Catalog',
        icon: FileText,
        roles: ['Manager', 'HR', 'Director'],
      },
      {
        path: '/analytics',
        label: 'Payroll Analytics',
        icon: TrendingUp,
        roles: ['HR', 'Director'],
      },
    ];

    return links.filter((link) => link.roles.includes(role));
  };

  const navLinks = getNavigationLinks();

  return (
    <div
      className={`relative flex flex-col bg-[#0f172a] text-slate-200 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } border-r border-[#1e293b]`}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#1e293b] px-5">
        <div className="flex items-center gap-3">
          <img 
            src="/increo logo.png" 
            alt="Increo Logo" 
            className="h-10 w-10 rounded-lg object-contain bg-white p-0.5" 
          />
          {!isCollapsed && <span className="font-bold tracking-tight text-white text-lg">Increo</span>}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#1e293b] bg-[#0f172a] hover:bg-[#1e293b]"
        >
          {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors border-l-4 ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-600/10 text-white'
                    : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {!isCollapsed && <span>{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User info */}
      <div className="border-t border-[#1e293b] p-4">
        {!isCollapsed && (
          <div className="mb-4 rounded-lg bg-[#1e293b]/50 p-3">
            <div className="truncate text-xs font-semibold text-white">{user.full_name}</div>
            <div className="truncate text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{user.role}</div>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-colors`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};
