import { useState } from "react";
import { UserCircle, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useClickOutside } from "../hooks/useClickOutside";

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Close the menu when clicking anywhere outside it.
    const ref = useClickOutside(() => setOpen(false));

    return (
        <div className="relative" ref={ref}>
            {/* Trigger */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-bg"
            >
                <UserCircle size={20} className="text-text-muted" />
                <span className="hidden text-sm font-medium sm:inline">{user?.name ?? "Account"}</span>
                <ChevronDown
                    size={14}
                    className={`text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg">
                    <div className="border-b border-border px-4 py-2">
                        <div className="text-sm font-medium">{user?.name ?? "Account"}</div>
                        <div className="text-xs text-text-muted">{user.email}</div>
                    </div>

                    <MenuItem
                        icon={User}
                        label="Profile"
                        onClick={() => {
                            setOpen(false);
                            navigate("/settings");
                        }}
                    />
                    <MenuItem
                        icon={Settings}
                        label="Settings"
                        onClick={() => {
                            setOpen(false);
                            navigate("/settings");
                        }}
                    />

                    <div className="my-1 border-t border-border" />

                    <MenuItem
                        icon={LogOut}
                        label="Sign out"
                        danger
                        onClick={() => {
                            setOpen(false);
                            logout();
                        }}
                    />
                </div>
            )}
        </div>
    );
}

// Small helper for a single menu row.
function MenuItem({ icon: Icon, label, onClick, danger }) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm hover:bg-bg ${danger ? "text-risk-red" : "text-text"
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    );
}