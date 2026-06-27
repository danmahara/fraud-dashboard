import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";
import { useStats } from "../hooks/useStats";
import StatCard from "../components/StatCard";

// Pull the themed risk colors from CSS variables so charts match the app.
const cssVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const RISK_COLORS = {
    GREEN: cssVar("--color-risk-green") || "#16a34a",
    YELLOW: cssVar("--color-risk-yellow") || "#ca8a04",
    ORANGE: cssVar("--color-risk-orange") || "#ea580c",
    RED: cssVar("--color-risk-red") || "#dc2626",
};

export default function AnalyticsPage() {
    const { data, isLoading, isError } = useStats();

    if (isLoading) {
        return <div className="text-text-muted">Loading analytics…</div>;
    }
    if (isError) {
        return (
            <div className="rounded-xl bg-primary-light p-4 text-sm text-risk-red">
                Couldn't load analytics. Is the backend running?
            </div>
        );
    }

    const flaggedPct = (data.flaggedRate * 100).toFixed(1);

    return (
        <div>
            <h1 className="mb-1 text-2xl font-bold">Analytics</h1>
            <p className="mb-6 text-sm text-text-muted">
                Fraud detection statistics across all transactions
            </p>

            {/* Headline numbers */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Transactions" value={data.totalTransactions} />
                <StatCard label="Flagged" value={data.flaggedCount} accent="text-risk-orange" />
                <StatCard label="Flag Rate" value={`${flaggedPct}%`} accent="text-risk-red" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Risk distribution donut */}
                <div className="rounded-xl border border-border bg-surface p-5">
                    <h2 className="mb-4 font-semibold">Risk Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.byRiskLevel}
                                dataKey="count"
                                nameKey="label"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                            >
                                {data.byRiskLevel.map((entry) => (
                                    <Cell
                                        key={entry.label}
                                        fill={RISK_COLORS[entry.label] || "#94a3b8"}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Category bar chart */}
                <div className="rounded-xl border border-border bg-surface p-5">
                    <h2 className="mb-4 font-semibold">Transactions by Category</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart
                            data={data.byCategory}
                            layout="vertical"
                            margin={{ left: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis
                                type="category"
                                dataKey="label"
                                width={90}
                                tick={{ fontSize: 11 }}
                            />
                            <Tooltip />
                            <Bar
                                dataKey="count"
                                fill={cssVar("--color-primary") || "#2563eb"}
                                radius={[0, 4, 4, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}