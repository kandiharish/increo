import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick testing logs for the user to try out different roles
  const handleQuickLogin = async (roleEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      await login(roleEmail, 'SecurePass123!');
      navigate('/');
    } catch (err: any) {
      setError('Quick login failed. Make sure database is running and seeded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-md rounded-xl border border-[#e2e8f0] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Increo Platform</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Appraisal Planning Session</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in to plan and verify salary budgets</p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-3 text-xs text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-[#cbd5e1] bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-[#cbd5e1] bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 border-t border-[#f1f5f9] pt-6">
          <span className="block text-center text-xs font-medium text-slate-400">Developer Quick Sandbox Accounts</span>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('harshal.pahade@increo.com')}
              className="rounded-lg border border-slate-200 bg-white py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Manager
            </button>
            <button
              onClick={() => handleQuickLogin('hr@increo.com')}
              className="rounded-lg border border-slate-200 bg-white py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              HR Admin
            </button>
            <button
              onClick={() => handleQuickLogin('director@increo.com')}
              className="rounded-lg border border-slate-200 bg-white py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
            >
              Director
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
