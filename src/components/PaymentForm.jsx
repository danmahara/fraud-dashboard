import { useState } from "react";
import { CreditCard, Loader2, CheckCircle2, ShieldAlert, XCircle, ChevronDown, AlertCircle } from "lucide-react";
import { useMyAccounts, useMerchants, useCreateTransaction } from "../hooks/usePayment";
import { getDeviceInfo } from "../utils/device";

const CHANNELS = ["POS", "ONLINE", "APP", "ATM"];

export default function PaymentForm() {
    const { data: accounts } = useMyAccounts();
    const { data: merchants } = useMerchants();
    const createTxn = useCreateTransaction();

    // The account to charge (default to the user's first account).
    const account = accounts?.[0];

    // "select" = pick from dropdown; "handle" = pay by phone/email
    const [mode, setMode] = useState("select");
    const [merchantId, setMerchantId] = useState("");
    const [handle, setHandle] = useState("");
    const [amount, setAmount] = useState("");
    const [channel, setChannel] = useState("POS");
    const [result, setResult] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
        setResult(null);

        const { deviceId } = getDeviceInfo();

        // Build the merchant reference based on the chosen mode.
        const merchantRef =
            mode === "select"
                ? { merchantId: Number(merchantId) }
                : handle.includes("@")
                    ? { merchantEmail: handle.trim() }
                    : { merchantPhone: handle.trim() };

        createTxn.mutate(
            {
                accountId: account.id,
                amount: parseFloat(amount),
                channel,
                deviceId,
                ...merchantRef,
            },
            {
                onSuccess: (data) => setResult(data),
            }
        );
    }

    const canSubmit =
        account &&
        amount &&
        (mode === "select" ? merchantId : handle) &&
        !createTxn.isPending;

    const errorMessage =
        createTxn.error?.response?.data?.message ||
        (createTxn.isError ? "Payment failed. Please try again." : "");

    return (
        <div>
            {/* Account line */}
            {account && (
                <div className="mb-4 flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0B1120] px-4 py-3">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-white/30">
                        Paying from
                    </span>
                    <span className="font-mono text-[13px] text-white/70">
                        {account.accountNumber} · ${Number(account.balance).toLocaleString()}
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mode toggle */}
                <div className="flex gap-2">
                    <ModeButton active={mode === "select"} onClick={() => setMode("select")}>
                        Choose merchant
                    </ModeButton>
                    <ModeButton active={mode === "handle"} onClick={() => setMode("handle")}>
                        Pay by phone / email
                    </ModeButton>
                </div>

                {/* Merchant selection */}
                {mode === "select" ? (
                    <div>
                        <label className={labelClass}>Merchant</label>
                        <div className="relative">
                            <select
                                value={merchantId}
                                onChange={(e) => setMerchantId(e.target.value)}
                                className={`${inputClass} appearance-none pr-10`}
                            >
                                <option value="">Select a merchant…</option>
                                {merchants?.map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.name} — {m.categoryDisplayName}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className={labelClass}>Merchant phone or email</label>
                        <input
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="9801234567 or pay@merchant.com"
                            className={inputClass}
                        />
                    </div>
                )}

                {/* Amount */}
                <div>
                    <label className={labelClass}>Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className={`${inputClass} pl-7`}
                        />
                    </div>
                </div>

                {/* Channel */}
                <div>
                    <label className={labelClass}>Channel</label>
                    <div className="grid grid-cols-4 gap-2">
                        {CHANNELS.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setChannel(c)}
                                className={`rounded-lg border py-2 text-[12px] font-medium transition-all ${channel === c
                                    ? "border-[#00C2FF] bg-[#00C2FF]/10 text-[#00C2FF]"
                                    : "border-white/10 bg-[#0B1120] text-white/50 hover:border-white/20"
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {errorMessage && (
                    <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-3 py-2 text-sm text-[#EF4444]">
                        {errorMessage}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#00C2FF] px-4 py-3 font-semibold text-[#0B1120] transition-all hover:bg-[#00D4FF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {createTxn.isPending ? (
                        <><Loader2 size={16} className="animate-spin" /> Processing…</>
                    ) : (
                        <><CreditCard size={16} /> Pay now</>
                    )}
                </button>
            </form>

            {/* Decision result */}
            {result && <DecisionResult result={result} />}
        </div>
    );
}

function DecisionResult({ result }) {
    const map = {
        GREEN: {
            icon: CheckCircle2, color: "#00E5B8",
            title: "Payment approved",
            body: "Your payment went through.",
        },
        YELLOW: {
            icon: AlertCircle, color: "#F59E0B",
            title: "Approved - monitored",
            body: "Your payment went through, but we noticed something slightly unusual and flagged it for monitoring.",
        },
        ORANGE: {
            icon: ShieldAlert, color: "#F97316",
            title: "Verification required",
            body: "This payment looked unusual, so we need to verify it's you.",
        },
        RED: {
            icon: XCircle, color: "#EF4444",
            title: "Payment declined",
            body: "This payment was blocked as high-risk.",
        },
    };
    const d = map[result.riskLevel] ?? map.GREEN;
    const Icon = d.icon;

    return (
        <div
            className="mt-5 rounded-xl border px-4 py-4"
            style={{ borderColor: `${d.color}40`, backgroundColor: `${d.color}14` }}
        >
            <div className="flex items-start gap-3">
                <Icon size={20} style={{ color: d.color }} className="mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-[14px] font-semibold" style={{ color: d.color }}>{d.title}</p>
                    <p className="mt-0.5 text-[13px] text-white/50">{d.body}</p>
                    <p className="mt-2 font-mono text-[11px] text-white/30">
                        #{result.transactionId} · {result.riskLevel} · {result.status}
                    </p>
                </div>
            </div>
        </div>
    );
}

function ModeButton({ active, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex-1 rounded-lg border px-3 py-2 text-[12px] font-medium transition-all ${active
                ? "border-[#00C2FF]/40 bg-[#00C2FF]/10 text-[#00C2FF]"
                : "border-white/10 bg-[#0B1120] text-white/50 hover:border-white/20"
                }`}
        >
            {children}
        </button>
    );
}

const labelClass = "mb-1.5 block text-[13px] font-medium text-white/70";
const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#0B1120] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#00C2FF]/50";