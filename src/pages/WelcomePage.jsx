import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    ShieldCheck, Brain, Activity, MapPin, ArrowRight,
    CheckCircle2, Eye, AlertTriangle, XCircle,
} from "lucide-react";
import AppNavbar from "../components/AppNavbar";

/* ─────────────────────────────────────────────
   Live scanner data
───────────────────────────────────────────── */
const TRANSACTIONS = [
    { emoji: "🛒", name: "Amazon Prime", meta: "Seattle, WA · Consumer", amount: "$14.99", status: "ok" },
    { emoji: "✈️", name: "Qatar Airways", meta: "Doha, QA · Travel", amount: "$4,280.00", status: "block" },
    { emoji: "🍔", name: "Shake Shack", meta: "New York, NY · Food", amount: "$22.40", status: "ok" },
    { emoji: "💊", name: "CVS Pharmacy", meta: "Boston, MA · Health", amount: "$68.15", status: "warn" },
    { emoji: "🎮", name: "Steam Store", meta: "Unknown · Gaming", amount: "$359.99", status: "verify" },
    { emoji: "⛽", name: "Shell Gas", meta: "Austin, TX · Auto", amount: "$55.30", status: "ok" },
];

const STATUS_META = {
    ok: { label: "APPROVED", score: 12, bar: "bg-[#00E5B8]", text: "text-[#00E5B8]", badge: "bg-[#00E5B8]/10 text-[#00E5B8] border border-[#00E5B8]/30" },
    warn: { label: "MONITORED", score: 48, bar: "bg-[#F59E0B]", text: "text-[#F59E0B]", badge: "bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30" },
    verify: { label: "VERIFY", score: 71, bar: "bg-[#F97316]", text: "text-[#F97316]", badge: "bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30" },
    block: { label: "BLOCKED", score: 89, bar: "bg-[#EF4444]", text: "text-[#EF4444]", badge: "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30" },
};

const SCAN_BADGE = "bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/30";

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function LiveScanner() {
    const [pool, setPool] = useState([...TRANSACTIONS]);
    const [active, setActive] = useState(null); // index 0-2 that is "resolved"
    const [score, setScore] = useState(12);
    const timerRef = useRef(null);

    useEffect(() => {
        const cycle = () => {
            setPool(prev => {
                const next = [...prev];
                next.unshift(next.pop());
                return next;
            });
            const resolved = Math.floor(Math.random() * 3);
            setActive(resolved);

            timerRef.current = setTimeout(() => {
                setActive(null);
                timerRef.current = setTimeout(cycle, 1000);
            }, 1800);
        };

        timerRef.current = setTimeout(cycle, 800);
        return () => clearTimeout(timerRef.current);
    }, []);

    useEffect(() => {
        if (active !== null) {
            const s = pool[active].status;
            setScore(STATUS_META[s].score);
        }
    }, [active, pool]);

    const shown = pool.slice(0, 3);
    const activeTxn = active !== null ? shown[active] : null;
    const meta = activeTxn ? STATUS_META[activeTxn.status] : STATUS_META.ok;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#141D2F] p-6">
            {/* subtle tint */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#00C2FF]/5 to-transparent" />

            {/* header */}
            <div className="mb-5 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                    Live transactions
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#00E5B8]">
                    <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#00E5B8]" />
                    Monitoring
                </span>
            </div>

            {/* transaction rows */}
            <div className="space-y-2">
                {shown.map((t, i) => {
                    const resolved = active === i;
                    const m = STATUS_META[t.status];
                    return (
                        <div
                            key={t.name}
                            className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0B1120] px-4 py-3 transition-all duration-300"
                        >
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 text-base">
                                {t.emoji}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-medium text-white">{t.name}</p>
                                <p className="font-mono text-[11px] text-white/40">{t.meta}</p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                                <p className="font-mono text-[14px] font-medium text-white">{t.amount}</p>
                                <span className={`mt-1 inline-block rounded px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide ${resolved ? m.badge : SCAN_BADGE}`}>
                                    {resolved ? m.label : "SCANNING"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* risk score bar */}
            <div className="mt-5 border-t border-white/[0.08] pt-4">
                <div className="mb-2 flex justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">Risk score</span>
                    <span className={`font-mono text-[11px] font-medium transition-colors duration-500 ${meta.text}`}>
                        {score} / 100
                    </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ${meta.bar}`}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

function LayerCard({ icon: Icon, step, title, body, iconColor, iconBg }) {
    return (
        <div className="group rounded-2xl border border-white/10 bg-[#141D2F] p-6 transition-all duration-200 hover:border-[#00C2FF]/30">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[#00C2FF]">{step}</p>
            <div className={`mb-4 inline-flex rounded-xl border p-3 ${iconBg}`}>
                <Icon size={22} className={iconColor} />
            </div>
            <h3 className="mb-2 text-[16px] font-semibold text-white">{title}</h3>
            <p className="text-[13px] leading-relaxed text-white/50">{body}</p>
        </div>
    );
}

function RiskCard({ dotColor, level, desc, range, cardBorder, badgeBg }) {
    return (
        <div className={`rounded-2xl border bg-[#141D2F] p-5 transition-all duration-200 hover:-translate-y-0.5 ${cardBorder}`}>
            <div className="mb-3 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: dotColor }} />
                <span className="text-[15px] font-semibold text-white">{level}</span>
            </div>
            <p className="text-[13px] leading-relaxed text-white/50">{desc}</p>
            <span className={`mt-3 inline-block rounded px-2 py-1 font-mono text-[10px] font-medium ${badgeBg}`}>
                {range}
            </span>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function WelcomePage() {
    return (
        <div className="min-h-screen bg-[#0B1120] text-white">
            <AppNavbar />

            {/* ── Hero ── */}
            <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-20 lg:grid-cols-2">
                {/* left */}
                <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#00C2FF]/30 bg-[#00C2FF]/10 px-3 py-1.5">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#00E5B8]" />
                        <span className="font-mono text-[11px] uppercase tracking-widest text-[#00C2FF]">
                            Real-time monitoring
                        </span>
                    </div>

                    <h1 className="mb-5 text-4xl font-bold leading-[1.12] text-white sm:text-5xl">
                        Fraud caught the moment it happens,{" "}
                        <span className="text-[#00C2FF]">not after the money's gone.</span>
                    </h1>

                    <p className="mb-8 max-w-lg text-[16px] leading-relaxed text-white/50">
                        Every transaction is scored in milliseconds by three independent layers.
                        Legitimate payments pass instantly; suspicious ones get stopped.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#00C2FF] px-6 py-3 text-[15px] font-semibold text-[#0B1120] transition-all hover:-translate-y-0.5 hover:bg-[#00D4FF]"
                        >
                            Get started <ArrowRight size={17} />
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-[15px] text-white transition-all hover:bg-white/10 hover:border-white/25"
                        >
                            Log in
                        </Link>
                    </div>
                </div>

                {/* right: live scanner */}
                <LiveScanner />
            </section>

            {/* ── Three Layers ── */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-widest text-[#00C2FF]">
                    Detection engine
                </p>
                <h2 className="mb-2 text-center text-[28px] font-bold text-white">Three layers, one decision</h2>
                <p className="mb-12 text-center text-[15px] text-white/50">Each layer catches what the others miss.</p>

                <div className="grid gap-6 md:grid-cols-3">
                    <LayerCard
                        icon={Brain}
                        step="Layer 01"
                        title="Machine learning"
                        body="Isolation Forest and gradient-boosted models score intrinsic risk from amount, category, location, and timing."
                        iconColor="text-[#00C2FF]"
                        iconBg="border-[#00C2FF]/25 bg-[#00C2FF]/10"
                    />
                    <LayerCard
                        icon={Activity}
                        step="Layer 02"
                        title="Behavioural analysis"
                        body="Each payment is compared against the cardholder's own history: typical spend, usual devices, and normal patterns."
                        iconColor="text-[#00E5B8]"
                        iconBg="border-[#00E5B8]/25 bg-[#00E5B8]/10"
                    />
                    <LayerCard
                        icon={MapPin}
                        step="Layer 03"
                        title="Context rules"
                        body="Distance from home, transaction velocity, and unusual hours add situational signals a model alone can miss."
                        iconColor="text-[#A78BFA]"
                        iconBg="border-[#A78BFA]/25 bg-[#A78BFA]/10"
                    />
                </div>
            </section>

            {/* ── Risk levels ── */}
            <section className="border-y border-white/[0.07] bg-[#0E1829] py-20">
                <div className="mx-auto max-w-6xl px-6">
                    <p className="mb-3 text-center font-mono text-[11px] uppercase tracking-widest text-[#00C2FF]">
                        Decision engine
                    </p>
                    <h2 className="mb-2 text-center text-[28px] font-bold text-white">From score to action</h2>
                    <p className="mb-10 text-center text-[15px] text-white/50">Friction only when it's warranted.</p>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <RiskCard
                            dotColor="#00E5B8"
                            level="Approved"
                            desc="Low risk. Passes instantly with no friction added to the experience."
                            range="Score 0 – 30"
                            cardBorder="border-[#00E5B8]/20"
                            badgeBg="bg-[#00E5B8]/10 text-[#00E5B8]"
                        />
                        <RiskCard
                            dotColor="#F59E0B"
                            level="Monitored"
                            desc="Slightly unusual. Approved but flagged for passive review."
                            range="Score 31 – 60"
                            cardBorder="border-[#F59E0B]/20"
                            badgeBg="bg-[#F59E0B]/10 text-[#F59E0B]"
                        />
                        <RiskCard
                            dotColor="#F97316"
                            level="Verify"
                            desc="Step-up challenge. A one-time code is required to proceed."
                            range="Score 61 – 80"
                            cardBorder="border-[#F97316]/20"
                            badgeBg="bg-[#F97316]/10 text-[#F97316]"
                        />
                        <RiskCard
                            dotColor="#EF4444"
                            level="Blocked"
                            desc="High risk. Declined and flagged for human review immediately."
                            range="Score 81 – 100"
                            cardBorder="border-[#EF4444]/20"
                            badgeBg="bg-[#EF4444]/10 text-[#EF4444]"
                        />
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-8 text-center">
                <div className="inline-flex items-center gap-2 font-mono text-[13px] text-white/30">
                    <ShieldCheck size={16} className="text-[#00C2FF]" />
                    FraudGuard — Real-Time Fraud Detection System
                </div>
            </footer>
        </div>
    );
}