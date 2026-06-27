import { AlertTriangle } from "lucide-react";
import RiskBadge from "./RiskBadge";

// A single label/value row.
function Row({ label, value }) {
    return (
        <div className="flex justify-between border-b border-border py-2 last:border-0">
            <span className="text-sm text-text-muted">{label}</span>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

export default function TransactionDetail({ t }) {
    if (!t) return null;

    return (
        <div>
            {/* Header: amount + risk */}
            <div className="mb-4 flex items-center justify-between">
                <span className="text-2xl font-bold">${Number(t.amount).toFixed(2)}</span>
                <RiskBadge level={t.riskLevel} />
            </div>

            <Row label="Transaction ID" value={t.id} />
            <Row label="Cardholder" value={t.userEmail} />
            <Row label="Merchant" value={t.merchant} />
            <Row label="Category" value={t.merchantCategory} />
            <Row label="Channel" value={t.channel} />
            <Row label="Decision" value={t.status} />
            <Row
                label="Fraud Score"
                value={t.fraudScore != null ? t.fraudScore.toFixed(4) : "—"}
            />
            <Row label="Time" value={new Date(t.transactionTime).toLocaleString()} />

            {/* Reasons — only when the context layer flagged something */}
            {t.flagReasons?.length > 0 && (
                <div className="mt-4 rounded-lg bg-bg p-4">
                    <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-risk-orange">
                        <AlertTriangle size={16} /> Why this was flagged
                    </div>
                    <ul className="list-inside list-disc space-y-1 text-sm text-text-muted">
                        {t.flagReasons.map((r, i) => (
                            <li key={i}>{r}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}