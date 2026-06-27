import RiskBadge from "./RiskBadge";

export default function TransactionTable({ transactions }) {
    if (!transactions?.length) {
        return (
            <div className="rounded-xl border border-border bg-surface p-8 text-center text-text-muted">
                No transactions yet. Run the generator to see the feed populate.
            </div>
        );
    }

    const rows = transactions.slice(0, 10);

    return (
        <>
            {/* ---------- Desktop / tablet: real table (md and up) ---------- */}
            {/* overflow-x-auto is a safety net so it scrolls if the screen is just
          slightly too narrow rather than overflowing the page. */}
            <div className="hidden overflow-x-auto rounded-xl border border-border bg-surface md:block">
                <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                        <tr>
                            <th className="px-4 py-3">Risk</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Merchant</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Channel</th>
                            <th className="px-4 py-3">Decision</th>
                            <th className="px-4 py-3">Score</th>
                            <th className="px-4 py-3">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((t) => (
                            <tr
                                key={t.id}
                                className="border-b border-border last:border-0 hover:bg-bg"
                            >
                                <td className="px-4 py-3">
                                    <RiskBadge level={t.riskLevel} />
                                </td>
                                <td className="px-4 py-3 font-medium">
                                    ${Number(t.amount).toFixed(2)}
                                </td>
                                <td className="px-4 py-3">{t.merchant}</td>
                                <td className="px-4 py-3 text-text-muted">{t.merchantCategory}</td>
                                <td className="px-4 py-3 text-text-muted">{t.channel}</td>
                                <td className="px-4 py-3">{t.status}</td>
                                <td className="px-4 py-3 tabular-nums">
                                    {t.fraudScore != null ? t.fraudScore.toFixed(4) : "—"}
                                </td>
                                <td className="px-4 py-3 text-text-muted">
                                    {new Date(t.transactionTime).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ---------- Mobile: stacked cards (below md) ---------- */}
            <div className="space-y-3 md:hidden">
                {rows.map((t) => (
                    <div
                        key={t.id}
                        className="rounded-xl border border-border bg-surface p-4"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <RiskBadge level={t.riskLevel} />
                            <span className="text-lg font-bold">
                                ${Number(t.amount).toFixed(2)}
                            </span>
                        </div>

                        <div className="font-medium">{t.merchant}</div>
                        <div className="mb-3 text-sm text-text-muted">
                            {t.merchantCategory} · {t.channel}
                        </div>

                        {/* Label/value grid for the remaining fields. */}
                        <div className="grid grid-cols-2 gap-y-1 text-sm">
                            <span className="text-text-muted">Decision</span>
                            <span className="text-right">{t.status}</span>

                            <span className="text-text-muted">Score</span>
                            <span className="text-right tabular-nums">
                                {t.fraudScore != null ? t.fraudScore.toFixed(4) : "—"}
                            </span>

                            <span className="text-text-muted">Time</span>
                            <span className="text-right">
                                {new Date(t.transactionTime).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}