import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import Placeholder from "./pages/Placeholder";
import AnalyticsPage from "./pages/AnalyticsPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Everything inside here shares the sidebar layout and needs auth. */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/transactions"
                element={<Placeholder title="Transactions" description="Full searchable transaction history" />}
              />
              <Route
                path="/alerts"
                element={<Placeholder title="Alerts" description="Fraud alerts awaiting review" />}
              />
              <Route
                path="/analytics"
                element={<AnalyticsPage />} />
              <Route
                path="/users"
                element={<Placeholder title="Users" description="Cardholders and their profiles" />}
              />
              <Route
                path="/settings"
                element={<Placeholder title="Settings" description="System configuration" />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}