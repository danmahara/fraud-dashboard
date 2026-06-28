import { useState } from "react";
import { Receipt, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useMyTransactionsPage } from "../hooks/usePayment";

const PAGE_SIZE = 5;

function riskStyle(risk) {
    switch (risk) {
        case "GREEN": return { label: "Approved", cls: "text-[#00E5B8] bg-[#00E5B8]/10 border-[#00E5B8]/20" };
        case "YELLOW": return { label: "Monitored", cls: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20" };
        case "ORANGE": return { label: "Verify", cls: "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20" };
        case "RED": return { label: "Blocked", cls: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20" };
        default: return { label: risk ?? "—", cls: "text-white/50 bg-white/5 border-white/10" };
    }
}

function formatTime(ts) {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        + ", " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function UserTransactionsPage() {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useMyTransactionsPage(page, PAGE_SIZE);

    const txns = data?.content ?? [];
    const totalPages = data?.totalPages ?? 0;
    const totalElements = data?.totalElements ?? 0;

    return (
        <div className="min-h-screen bg-[#0B1120] text-white">
            <main className="mx-auto max-w-4xl px-6 py-10">
                {/* Header */}
                <div className="mb-6">
                    <div className="mb-1 flex items-center gap-2">
                        <Receipt size={15} className="text-[#00C2FF]" />
                        <span className="font-mono text-[11px] uppercase tracking-widest text-white/30">
                            Transaction history
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold">Your transactions</h1>
                    <p className="mt-1 text-[14px] text-white/40">
                        {totalElements} {totalElements === 1 ? "transaction" : "transactions"} total
                    </p>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141D2F]">
                    {/* Header row (desktop) */}
                    <div className="hidden border-b border-white/[0.06] px-5 py-3 sm:grid sm:grid-cols-[1.5fr_1fr_1fr_1fr] sm:gap-4">
                        {["Merchant", "Amount", "When", "Status"].map((h) => (
                            <span key={h} className="font-mono text-[10px] uppercase tracking-widest text-white/30">{h}</span>
                        ))}
                    </div>

                    {isLoading && txns.length === 0 ? (
                        <div className="px-5 py-12 text-center text-[13px] text-white/30">Loading…</div>
                    ) : txns.length === 0 ? (
                        <div className="px-5 py-12 text-center text-[13px] text-white/25">No transactions yet</div>
                    ) : (
                        txns.map((t) => {
                            const s = riskStyle(t.riskLevel);
                            return (
                                <div
                                    key={t.id}
                                    className="border-b border-white/[0.04] px-5 py-4 last:border-0 sm:grid sm:grid-cols-[1.5fr_1fr_1fr_1fr] sm:items-center sm:gap-4"
                                >
                                    <div className="mb-2 sm:mb-0">
                                        <p className="text-[14px] font-medium text-white">{t.merchant}</p>
                                        <p className="font-mono text-[11px] text-white/30">{t.merchantCategory}</p>
                                    </div>
                                    <p className="font-mono text-[14px] font-semibold text-white">
                                        ${Number(t.amount).toLocaleString()}
                                    </p>
                                    <p className="flex items-center gap-1.5 text-[12px] text-white/40">
                                        <Clock size={12} /> {formatTime(t.transactionTime)}
                                    </p>
                                    <div>
                                        <span className={`inline-block rounded border px-2 py-0.5 font-mono text-[10px] ${s.cls}`}>
                                            {s.label}
                                        </span>
                                        {t.flagReasons?.length > 0 && (
                                            <p className="mt-1 text-[11px] text-white/30">{t.flagReasons.join(", ")}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                    <div className="mt-5 flex items-center justify-between">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white/60 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={14} /> Previous
                        </button>

                        <span className="font-mono text-[12px] text-white/40">
                            Page {page + 1} of {totalPages}
                        </span>

                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white/60 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}