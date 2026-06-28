import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminTransactionsPage } from "../hooks/useTransactions";
import TransactionTable from "../components/TransactionTable";

const PAGE_SIZE = 10;

export default function AdminTransactionsPage() {
    const [page, setPage] = useState(0);
    const { data, isLoading } = useAdminTransactionsPage(page, PAGE_SIZE);

    const txns = data?.content ?? [];
    const totalPages = data?.totalPages ?? 0;
    const totalElements = data?.totalElements ?? 0;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text">Transactions</h1>
                <p className="mt-1 text-sm text-text-muted">
                    {totalElements} total transactions
                </p>
            </div>

            {isLoading && txns.length === 0 ? (
                <div className="rounded-xl border border-border bg-bg-surface p-12 text-center text-text-muted">
                    Loading…
                </div>
            ) : (
                <>
                    <TransactionTable transactions={txns} />

                    {totalPages > 1 && (
                        <div className="mt-5 flex items-center justify-between">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="flex items-center gap-1 rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-text-muted transition-all hover:bg-bg-hover disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={14} /> Previous
                            </button>

                            <span className="text-sm text-text-muted">
                                Page {page + 1} of {totalPages}
                            </span>

                            <button
                                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="flex items-center gap-1 rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-text-muted transition-all hover:bg-bg-hover disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}