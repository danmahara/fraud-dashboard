import { Menu, Bell, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu";

export default function Navbar({ onToggleSidebar }) {
    const { logout } = useAuth();

    return (
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
            {/* Left: hamburger (mobile only) + page brand */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="rounded-lg p-1.5 text-text-muted hover:bg-bg lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>
                <span className="font-semibold text-text">Admin Console</span>
            </div>

            {/* Right: actions. Labels hide on very small screens, icons stay. */}
            <div className="flex items-center gap-1">
                <button
                    className="relative rounded-lg p-2 text-text-muted hover:bg-bg"
                    aria-label="Notifications"
                >
                    <Bell size={18} />
                    {/* little unread dot */}
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk-red" />
                </button>


                <UserMenu />
            </div>
        </header>
    );
}