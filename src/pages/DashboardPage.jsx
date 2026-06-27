import { useStats } from "../hooks/useStats";
import { useTransactions } from "../hooks/useTransactions";
import StatCard from "../components/StatCard";
import TransactionTable from "../components/TransactionTable";

export default function DashboardPage() {
    const { data: stats } = useStats();
    const { data: transactions = [], isError } = useTransactions(10);

    return (
        <div>
            <h1 className="mb-1 text-2xl font-bold">Overview</h1>
            <p className="mb-6 text-sm text-text-muted">Live transaction monitoring</p>

            {/* All-time totals */}
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Transactions" value={stats?.totalTransactions ?? "-"} />
                <StatCard label="Flagged" value={stats?.flaggedCount ?? "-"} accent="text-risk-orange" />
                <StatCard label="Blocked" value={stats?.blockedCount ?? "-"} accent="text-risk-red" />
            </div>

            {/* Today */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Today's Transactions" value={stats?.todayTransactions ?? "—"} />
                <StatCard label="Flagged Today" value={stats?.todayFlagged ?? "-"} accent="text-risk-orange" />
                <StatCard label="Blocked Today" value={stats?.todayBlocked ?? "-"} accent="text-risk-red" />
            </div>

            <h2 className="mb-3 text-lg font-semibold">Recent Transactions</h2>
            {isError ? (
                <div className="rounded-xl bg-primary-light p-4 text-sm text-risk-red">
                    Couldn't load transactions.
                </div>
            ) : (
                <TransactionTable transactions={transactions} />
            )}
        </div>
    );
}