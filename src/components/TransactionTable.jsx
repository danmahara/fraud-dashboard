import { useState } from "react";
import { Eye } from "lucide-react";
import RiskBadge from "./RiskBadge";
import Modal from "./Modal";
import TransactionDetail from "./TransactionDetail";

export default function TransactionTable({ transactions }) {
    const [selected, setSelected] = useState(null); // the transaction shown in the modal

    if (!transactions?.length) {
        return (
            <div className="rounded-xl border border-border bg-surface p-8 text-center text-text-muted">
                No transactions yet. Run the generator to see the feed populate.
            </div>
        );
    }

    const rows = transactions

    return (
        <>
            {/* ---------- Desktop / tablet: table ---------- */}
            <div className="hidden overflow-x-auto rounded-xl border border-border bg-surface md:block">
                <table className="w-full text-left text-sm">
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
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((t) => (
                            <tr key={t.id} className="border-b border-border last:border-0 hover:bg-bg">
                                <td className="px-4 py-3">
                                    <RiskBadge level={t.riskLevel} />
                                </td>
                                <td className="px-4 py-3 font-medium">${Number(t.amount).toFixed(2)}</td>
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
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => setSelected(t)}
                                        className="rounded-lg p-1.5 text-text-muted hover:bg-primary-light hover:text-primary"
                                        aria-label="View details"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ---------- Mobile: cards ---------- */}
            <div className="space-y-3 md:hidden">
                {rows.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setSelected(t)}
                        className="block w-full rounded-xl border border-border bg-surface p-4 text-left"
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <RiskBadge level={t.riskLevel} />
                            <span className="text-lg font-bold">${Number(t.amount).toFixed(2)}</span>
                        </div>
                        <div className="font-medium">{t.merchant}</div>
                        <div className="text-sm text-text-muted">
                            {t.merchantCategory} · {t.channel} · {t.status}
                        </div>
                    </button>
                ))}
            </div>

            {/* Detail modal — shared by both layouts */}
            <Modal
                open={!!selected}
                onClose={() => setSelected(null)}
                title="Transaction Details"
            >
                <TransactionDetail t={selected} />
            </Modal>
        </>
    );
}