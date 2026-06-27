import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-bg">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Dim overlay behind the drawer on mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Navbar stays fixed at the top of the content column */}
                <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

                {/* Only this area scrolls */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}