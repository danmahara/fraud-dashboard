import { useState } from "react";
import { Eye, User as UserIcon, Shield } from "lucide-react";
import { useAdminUsers, useAdminUserDetail } from "../hooks/useUsers";
import Modal from "../components/Modal";

function formatDate(ts) {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminUsersPage() {
    const { data: users, isLoading } = useAdminUsers();
    const [selectedId, setSelectedId] = useState(null);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text">Users</h1>
                <p className="mt-1 text-sm text-text-muted">
                    {users?.length ?? 0} cardholders
                </p>
            </div>

            {/* <div className="overflow-hidden rounded-xl border border-border bg-bg-surface">
                <table className="w-full text-left text-sm"> */}
            <div className="overflow-x-auto rounded-xl border border-border bg-surface">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="border-b border-border text-text-muted">
                        <tr>
                            <th className="px-5 py-3 font-medium">Name</th>
                            <th className="px-5 py-3 font-medium">Email</th>
                            <th className="px-5 py-3 font-medium">Phone</th>
                            <th className="px-5 py-3 font-medium">Role</th>
                            <th className="px-5 py-3 font-medium">Transactions</th>
                            <th className="px-5 py-3 font-medium">Joined</th>
                            <th className="px-5 py-3 font-medium text-right">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={7} className="px-5 py-10 text-center text-text-muted">Loading…</td></tr>
                        ) : users?.length === 0 ? (
                            <tr><td colSpan={7} className="px-5 py-10 text-center text-text-muted">No users</td></tr>
                        ) : (
                            users?.map((u) => (
                                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-bg-hover">
                                    <td className="px-5 py-3 font-medium text-text">{u.name}</td>
                                    <td className="px-5 py-3 text-text-muted">{u.email}</td>
                                    <td className="px-5 py-3 text-text-muted">{u.phone}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${u.role === "ADMIN"
                                            ? "bg-purple-100 text-purple-700"
                                            : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {u.role === "ADMIN" ? <Shield size={11} /> : <UserIcon size={11} />}
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-text">{u.transactionCount}</td>
                                    <td className="px-5 py-3 text-text-muted">{formatDate(u.createdAt)}</td>
                                    <td className="px-5 py-3 text-right">
                                        <button
                                            onClick={() => {
                                                // console.log("user: ", u.id);
                                                setSelectedId(u.id)
                                            }}
                                            className="inline-flex rounded-lg p-1.5 text-text-muted hover:bg-bg-hover hover:text-text"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {
                selectedId && (
                    <Modal
                        open={!!selectedId}
                        onClose={() => setSelectedId(null)}
                        title="User Details"
                    >
                        {selectedId && <UserDetail id={selectedId} />}
                    </Modal>
                )
            }
        </div >
    );
}

function UserDetail({ id }) {
    const { data: user, isLoading } = useAdminUserDetail(id);

    if (isLoading) return <div className="p-6 text-center text-text-muted">Loading…</div>;
    if (!user) return null;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-text">{user.name}</h2>
                <p className="text-sm text-text-muted">{user.email} · {user.phone}</p>
                <p className="mt-1 text-xs text-text-muted">
                    {user.role} · Joined {formatDate(user.createdAt)}
                </p>
            </div>

            {/* Profile */}
            <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 text-sm font-semibold text-text">Profile</h3>
                {user.profileComplete ? (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <Detail label="Home" value={user.homeLat && user.homeLon ? `${Number(user.homeLat).toFixed(4)}, ${Number(user.homeLon).toFixed(4)}` : "—"} />
                        <Detail label="Date of birth" value={user.dob ? formatDate(user.dob) : "—"} />
                        <Detail label="Gender" value={user.gender ?? "—"} />
                    </div>
                ) : (
                    <p className="text-sm text-text-muted">Profile not completed</p>
                )}
            </div>

            {/* Accounts */}
            <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 text-sm font-semibold text-text">Accounts</h3>
                {user.accounts?.length ? user.accounts.map((a) => (
                    <div key={a.id} className="flex items-center justify-between py-1 text-sm">
                        <span className="font-mono text-text-muted">{a.accountNumber}</span>
                        <span className="text-text">${Number(a.balance).toLocaleString()}</span>
                        <span className="text-xs text-text-muted">{a.status}</span>
                    </div>
                )) : <p className="text-sm text-text-muted">No accounts</p>}
            </div>

            {/* Recent transactions */}
            <div className="rounded-lg border border-border p-4">
                <h3 className="mb-2 text-sm font-semibold text-text">Recent transactions</h3>
                {user.recentTransactions?.length ? (
                    <div className="space-y-1">
                        {user.recentTransactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between border-b border-border py-1.5 text-sm last:border-0">
                                <span className="text-text">{t.merchant}</span>
                                <span className="text-text-muted">${Number(t.amount).toLocaleString()}</span>
                                <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${riskColor(t.riskLevel)}`}>
                                    {t.riskLevel}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-sm text-text-muted">No transactions</p>}
            </div>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div>
            <p className="text-xs text-text-muted">{label}</p>
            <p className="text-text">{value}</p>
        </div>
    );
}

function riskColor(risk) {
    switch (risk) {
        case "GREEN": return "bg-green-100 text-green-700";
        case "YELLOW": return "bg-yellow-100 text-yellow-700";
        case "ORANGE": return "bg-orange-100 text-orange-700";
        case "RED": return "bg-red-100 text-red-700";
        default: return "bg-gray-100 text-gray-600";
    }
}