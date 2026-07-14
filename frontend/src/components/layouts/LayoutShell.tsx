import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PlanningProvider } from '../../contexts/PlanningContext';
import { ChevronRight, Home } from 'lucide-react';

export const LayoutShell: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <PlanningProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Workspace panel */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Action Header */}
          <Header />

          {/* Breadcrumbs Bar */}
          <div className="flex items-center gap-1.5 px-8 py-3 bg-white border-b border-[#e2e8f0] text-[11px] font-medium text-slate-500">
            <Link to="/" className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
              <Home size={12} />
              <span>Home</span>
            </Link>
            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              const title = value.charAt(0).toUpperCase() + value.slice(1);

              return (
                <React.Fragment key={to}>
                  <ChevronRight size={12} className="text-slate-300" />
                  {isLast ? (
                    <span className="text-slate-900 font-semibold">{title}</span>
                  ) : (
                    <Link to={to} className="hover:text-indigo-600 transition-colors">
                      {title}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Primary View Area */}
          <main className="flex-1 overflow-y-auto px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </PlanningProvider>
  );
};
