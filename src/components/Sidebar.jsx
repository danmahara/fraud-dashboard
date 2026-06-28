import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Receipt,
    ShieldAlert,
    BarChart3,
    Users,
    Settings,
    ShoppingBag,

} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/transactions", label: "Transactions", icon: Receipt },
    { to: "/alerts", label: "Alerts", icon: ShieldAlert },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/users", label: "Users", icon: Users },
    { to: "/merchants", label: "Merchants", icon: ShoppingBag },
    { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
    const { logout } = useAuth();

    return (
        <aside
            className={`fixed z-30 flex h-screen w-60 flex-col overflow-y-auto border-r border-border bg-surface transition-transform duration-200
        lg:static lg:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
            <div className="px-5 py-5">
                <div className="text-lg font-bold text-primary">Fraud Monitor</div>
                <div className="text-xs text-text-muted">Admin Console</div>
            </div>

            <nav className="flex-1 px-3">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={onClose}   // close the drawer after navigating (mobile)
                        className={({ isActive }) =>
                            `mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                                ? "bg-primary text-white"
                                : "text-text-muted hover:bg-bg hover:text-text"
                            }`
                        }
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-border p-3">
                <button
                    onClick={logout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-text-muted hover:bg-bg hover:text-risk-red"
                >
                    Sign out
                </button>
            </div>
        </aside>
    );
}