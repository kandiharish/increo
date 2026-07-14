import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleReturn = () => {
    navigate('/');
  };

  const handleSwitchAccount = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="mt-2 text-sm text-slate-500">
          Your current account profile ({user?.email} with role <strong>{user?.role}</strong>) does not have permissions to access this view.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleReturn}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none"
          >
            Return to Dashboard
          </button>
          <button
            onClick={handleSwitchAccount}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none"
          >
            Sign in as Different User
          </button>
        </div>
      </div>
    </div>
  );
};
