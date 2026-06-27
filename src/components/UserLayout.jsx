import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, Receipt, User, LogOut,
    ShieldCheck, Menu, X, ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useMyProfile } from "../hooks/useProfile";
import AppNavbar from "../components/AppNavbar";

const NAV_ITEMS = [
    { to: "/user", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/user/transactions", label: "Transactions", icon: Receipt },
    { to: "/user/onboarding", label: "Profile", icon: User },
];

function SidebarContent({ onNavigate }) {
    const { user, logout } = useAuth();
    const { data: profile } = useMyProfile();
    const navigate = useNavigate();
    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
        : "?";
    function handleLogout() {
        logout();
        navigate("/");
    }
    return (
        <div className="flex h-full flex-col">
            {/* User card */}
            <div className="border-b border-white/[0.07] px-4 py-4">
                <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00C2FF]/20 text-[13px] font-bold text-[#00C2FF]">
                        {initials}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-white">{user?.name ?? "Account"}</p>
                        <p className="truncate font-mono text-[11px] text-white/35">{user?.email}</p>
                    </div>
                    {profile?.profileComplete && (
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00E5B8]" title="Profile complete" />
                    )}
                </div>
            </div>
            {/* Nav */}
            <nav className="flex-1 space-y-0.5 px-3 py-4">
                <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-widest text-white/20">Menu</p>
                {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all ${isActive
                                ? "bg-[#00C2FF]/15 text-[#00C2FF]"
                                : "text-white/45 hover:bg-white/[0.05] hover:text-white/80"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon size={16} className={isActive ? "text-[#00C2FF]" : "text-white/30 group-hover:text-white/60"} />
                                <span className="flex-1">{label}</span>
                                {isActive && <ChevronRight size={13} className="text-[#00C2FF]/50" />}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
            {/* Sign out */}
            <div className="border-t border-white/[0.07] p-3">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-white/30 transition-all hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
                >
                    <LogOut size={15} />
                    Sign out
                </button>
            </div>
        </div>
    );
}

export default function UserLayout() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#0B1120]">
            {/* Full-width navbar on top */}
            <AppNavbar
                leftSlot={
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 hover:text-white lg:hidden"
                    >
                        <Menu size={16} />
                    </button>
                }
            />

            {/* Row below navbar: sidebar + content, bounded to remaining height */}
            <div className="flex flex-1 overflow-hidden">
                {/* Desktop sidebar — scrolls independently */}
                <aside className="hidden w-56 flex-shrink-0 overflow-y-auto border-r border-white/[0.07] bg-[#0D1526] lg:flex lg:flex-col">
                    <SidebarContent onNavigate={undefined} />
                </aside>

                {/* Mobile overlay */}
                {drawerOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
                        onClick={() => setDrawerOpen(false)}
                    />
                )}

                {/* Mobile drawer */}
                <aside
                    className={`fixed left-0 top-0 z-30 flex h-full w-56 flex-col overflow-y-auto border-r border-white/[0.07] bg-[#0D1526] transition-transform duration-200 lg:hidden ${drawerOpen ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-white/40 hover:text-white"
                    >
                        <X size={15} />
                    </button>
                    <SidebarContent onNavigate={() => setDrawerOpen(false)} />
                </aside>

                {/* Page content — scrolls independently */}
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}