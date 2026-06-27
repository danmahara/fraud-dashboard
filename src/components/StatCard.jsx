export default function StatCard({ label, value, accent = "text-text" }) {
    return (
        <div className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs uppercase tracking-wide text-text-muted">
                {label}
            </div>
            <div className={`mt-1 text-2xl font-bold ${accent}`}>{value}</div>
        </div>
    );
}