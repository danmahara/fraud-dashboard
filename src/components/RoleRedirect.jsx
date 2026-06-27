import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Decides where an authenticated user belongs based on role.
// ADMIN -> bank dashboard, USER -> customer home.
export default function RoleRedirect() {
    const { user } = useAuth();
    if (user?.role === "ADMIN") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/user" replace />; // USER customer area
}