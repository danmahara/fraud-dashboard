import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu";

export default function AppNavbar({ leftSlot }) {
    const { isAuthenticated, user } = useAuth();
    const isAdmin = user?.role === "ADMIN";
    const brandTarget = !isAuthenticated
        ? "/"
        : user?.role === "ADMIN"
            ? "/dashboard"
            : "/user";
    return (
        <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#0B1120]/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    {leftSlot}
                    <Link
                        to={brandTarget}
                        className="flex items-center gap-2 font-bold text-[#00C2FF] transition-opacity hover:opacity-80"
                    >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#00C2FF]/40 bg-[#00C2FF]/10">
                            <ShieldCheck size={15} />
                        </span>
                        <span className="font-mono text-[14px] tracking-wide">FraudGuard</span>
                    </Link>
                </div>

                {/* Right side */}
                {isAuthenticated ? (
                    <div className="flex items-center gap-2">
                        {!isAdmin && (
                            <Link
                                to="/"
                                className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white"
                            >
                                Home
                            </Link>
                        )}
                        <UserMenu />
                    </div>
                ) : (
                    <nav className="flex items-center gap-2">
                        <Link
                            to="/"
                            className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white"
                        >
                            Home
                        </Link>
                        <Link
                            to="/login"
                            className="rounded-lg px-4 py-2 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white"
                        >
                            Log in
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-lg bg-[#00C2FF] px-4 py-2 text-sm font-semibold text-[#0B1120] transition-all hover:bg-[#00D4FF] hover:-translate-y-px"
                        >
                            Get started
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}