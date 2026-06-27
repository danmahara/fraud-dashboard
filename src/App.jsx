import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import UserLayout from "./components/UserLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Placeholder from "./pages/Placeholder";
import AnalyticsPage from "./pages/AnalyticsPage";
import RoleRedirect from "./components/RoleRedirect";
import RegisterPage from "./pages/RegisterPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import WelcomePage from "./pages/WelcomePage";
import OnboardingPage from "./pages/OnboardingPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children, requireRole }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireRole && user?.role !== requireRole) return <RoleRedirect />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin area */}
            <Route
              element={
                <ProtectedRoute requireRole="ADMIN">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<Placeholder title="Transactions" description="Full searchable transaction history" />} />
              <Route path="/alerts" element={<Placeholder title="Alerts" description="Fraud alerts awaiting review" />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/users" element={<Placeholder title="Users" description="Cardholders and their profiles" />} />
              <Route path="/settings" element={<Placeholder title="Settings" description="System configuration" />} />
            </Route>

            {/* Customer area — UserLayout wraps all /user/* routes */}
            <Route
              element={
                <ProtectedRoute requireRole="USER">
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/user" element={<CustomerDashboard />} />
              <Route path="/user/onboarding" element={<OnboardingPage />} />
              <Route path="/user/transactions" element={<Placeholder title="Transactions" description="Your transaction history" />} />
            </Route>

            {/* Redirect after login */}
            <Route path="/home" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

            {/* Catch-all — MUST be last */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}