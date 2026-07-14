import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { LayoutShell } from './components/layouts/LayoutShell';
import { LoginPage } from './features/auth/LoginPage';
import { UnauthorizedPage } from './features/auth/UnauthorizedPage';
import { EmployeeListPage } from './features/employees/EmployeeListPage';
import { EmployeeProfilePage } from './features/employees/EmployeeProfilePage';
import { PlanningPage } from './features/planning/PlanningPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<LayoutShell />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/employees" element={<EmployeeListPage />} />
                <Route path="/employees/:id" element={<EmployeeProfilePage />} />
                <Route path="/planning" element={<PlanningPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
