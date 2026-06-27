import { useState } from "react";
import { UserCircle, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useClickOutside } from "../hooks/useClickOutside";

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const ref = useClickOutside(() => setOpen(false));

    const isAdmin = user?.role === "ADMIN";
    const profilePath = isAdmin ? "/settings" : "/user/profile";
    const settingsPath = isAdmin ? "/settings" : "/user/settings";

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : "?";

    return (
        <div className="relative" ref={ref}>
            {/* ── Trigger ── */}
            {isAdmin ? (
                /* Admin: light theme trigger */
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00C2FF]/20 text-[11px] font-bold text-[#00C2FF]">
                        {initials}
                    </span>
                    <span className="hidden text-sm font-medium text-gray-700 sm:inline">
                        {user?.name ?? "Account"}
                    </span>
                    <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                </button>
            ) : (
                /* User: dark theme trigger */
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 transition-all hover:border-white/20 hover:bg-white/10"
                >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00C2FF]/20 text-[10px] font-bold text-[#00C2FF]">
                        {initials}
                    </span>
                    <span className="hidden text-sm font-medium text-white sm:inline">
                        {user?.name ?? "Account"}
                    </span>
                    <ChevronDown
                        size={14}
                        className={`text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                </button>
            )}

            {/* ── Dropdown ── */}
            {open && (
                isAdmin ? (
                    /* Admin: light dropdown — uses your existing CSS vars */
                    <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg">
                        <div className="border-b border-border px-4 py-3">
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00C2FF]/15 text-[11px] font-bold text-[#00C2FF]">
                                    {initials}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-text">
                                        {user?.name ?? "Account"}
                                    </p>
                                    <p className="truncate text-xs text-text-muted">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="py-1">
                            <AdminMenuItem icon={User} label="Profile" onClick={() => { setOpen(false); navigate(profilePath); }} />
                            <AdminMenuItem icon={Settings} label="Settings" onClick={() => { setOpen(false); navigate(settingsPath); }} />
                        </div>
                        <div className="border-t border-border" />
                        <div className="py-1">
                            <AdminMenuItem icon={LogOut} label="Sign out" danger onClick={() => { setOpen(false); logout(); }} />
                        </div>
                    </div>
                ) : (
                    /* User: dark dropdown */
                    <div className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-xl border border-white/10 bg-[#141D2F] py-1 shadow-2xl shadow-black/40">
                        <div className="border-b border-white/[0.08] px-4 py-3">
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00C2FF]/20 text-[11px] font-bold text-[#00C2FF]">
                                    {initials}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-white">
                                        {user?.name ?? "Account"}
                                    </p>
                                    <p className="truncate font-mono text-[11px] text-white/40">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="py-1">
                            <DarkMenuItem icon={User} label="Profile" onClick={() => { setOpen(false); navigate(profilePath); }} />
                            <DarkMenuItem icon={Settings} label="Settings" onClick={() => { setOpen(false); navigate(settingsPath); }} />
                        </div>
                        <div className="border-t border-white/[0.08]" />
                        <div className="py-1">
                            <DarkMenuItem icon={LogOut} label="Sign out" danger onClick={() => { setOpen(false); logout(); }} />
                        </div>
                    </div>
                )
            )}
        </div>
    );
}

function AdminMenuItem({ icon: Icon, label, onClick, danger }) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors hover:bg-bg ${danger ? "text-risk-red" : "text-text"
                }`}
        >
            <Icon size={15} className={danger ? "text-risk-red" : "text-text-muted"} />
            {label}
        </button>
    );
}

function DarkMenuItem({ icon: Icon, label, onClick, danger }) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${danger
                ? "text-[#EF4444] hover:bg-[#EF4444]/10"
                : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
        >
            <Icon size={15} className={danger ? "text-[#EF4444]" : "text-white/40"} />
            {label}
        </button>
    );
}