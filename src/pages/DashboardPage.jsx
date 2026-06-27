import { useTransactions } from "../hooks/useTransactions";
import StatCard from "../components/StatCard";
import TransactionTable from "../components/TransactionTable";

export default function DashboardPage() {
    const { data: transactions = [], isError, dataUpdatedAt } =
        useTransactions(50);

    const flagged = transactions.filter((t) =>
        ["ORANGE", "RED"].includes(t.riskLevel)
    ).length;
    const blocked = transactions.filter((t) => t.riskLevel === "RED").length;

    return (
        <div>
            <div className="mb-1 flex items-baseline justify-between">
                <h1 className="text-2xl font-bold">Overview</h1>
                <span className="text-xs text-text-muted">
                    Updated {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "—"}
                </span>
            </div>
            <p className="mb-6 text-sm text-text-muted">
                Live transaction monitoring
            </p>

            <div className="mb-6 grid grid-cols-3 gap-4">
                <StatCard label="Transactions" value={transactions.length} />
                <StatCard label="Flagged" value={flagged} accent="text-risk-orange" />
                <StatCard label="Blocked" value={blocked} accent="text-risk-red" />
            </div>

            {isError ? (
                <div className="rounded-xl bg-primary-light p-4 text-sm text-risk-red">
                    Couldn't load transactions. Is the backend running and is this an ADMIN account?
                </div>
            ) : (
                <TransactionTable transactions={transactions} />
            )}
        </div>
    );
}