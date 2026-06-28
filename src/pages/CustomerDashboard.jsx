import { Link } from "react-router-dom";
import {
    AlertTriangle, MapPin, CreditCard, ArrowUpRight,
    ShieldCheck, Clock, TrendingUp, User, Calendar,
    Users, CheckCircle2, XCircle, AlertCircle,
} from "lucide-react";
import AppNavbar from "../components/AppNavbar";
import { useMyProfile } from "../hooks/useProfile";
import { useAuth } from "../context/AuthContext";
import PaymentForm from "../components/PaymentForm";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function formatDob(dob) {
    if (!dob) return null;
    const d = new Date(dob);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatGender(g) {
    if (!g) return null;
    return g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
}

function formatLocation(lat, lon) {
    if (!lat || !lon) return null;
    return `${parseFloat(lat).toFixed(4)}, ${parseFloat(lon).toFixed(4)}`;
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, iconColor, iconBg }) {
    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#141D2F] p-5">
            <div className="mb-4 flex items-center justify-between">
                <span className="text-[12px] font-medium uppercase tracking-widest text-white/40">
                    {label}
                </span>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
                    <Icon size={15} className={iconColor} />
                </span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            {sub && <p className="mt-1 text-[12px] text-white/40">{sub}</p>}
        </div>
    );
}

function ProfileField({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0B1120] px-4 py-3">
            <Icon size={15} className="flex-shrink-0 text-white/30" />
            <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-widest text-white/30">{label}</p>
                <p className="truncate text-[13px] font-medium text-white/80">{value}</p>
            </div>
        </div>
    );
}

/* Placeholder transaction row */
function TxnRow({ emoji, name, amount, status, time }) {
    const statusMap = {
        approved: { label: "Approved", color: "text-[#00E5B8]", bg: "bg-[#00E5B8]/10 border-[#00E5B8]/20" },
        monitored: { label: "Monitored", color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10 border-[#F59E0B]/20" },
        blocked: { label: "Blocked", color: "text-[#EF4444]", bg: "bg-[#EF4444]/10 border-[#EF4444]/20" },
        verify: { label: "Verify", color: "text-[#F97316]", bg: "bg-[#F97316]/10 border-[#F97316]/20" },
    };
    const s = statusMap[status] ?? statusMap.approved;
    return (
        <div className="flex items-center gap-4 border-b border-white/[0.05] px-1 py-3.5 last:border-0">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-base">
                {emoji}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-white">{name}</p>
                <p className="font-mono text-[11px] text-white/30">{time}</p>
            </div>
            <div className="flex-shrink-0 text-right">
                <p className="font-mono text-[13px] font-semibold text-white">{amount}</p>
                <span className={`mt-1 inline-block rounded border px-2 py-0.5 font-mono text-[10px] ${s.bg} ${s.color}`}>
                    {s.label}
                </span>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function CustomerDashboard() {
    const { data: profile, isLoading } = useMyProfile();
    const { user } = useAuth();
    const incomplete = !isLoading && profile && !profile.profileComplete;

    const firstName = user?.name?.split(" ")[0] ?? "there";

    return (
        <div className="min-h-screen bg-[#0B1120] text-white">
            <main className="mx-auto max-w-4xl px-6 py-10">

                {/* ── Incomplete profile banner ── */}
                {incomplete && (
                    <Link
                        to="/user/onboarding"
                        className="mb-8 flex items-center gap-3 rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/8 px-5 py-4 transition-all hover:bg-[#F59E0B]/12"
                    >
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]/15">
                            <AlertTriangle size={16} className="text-[#F59E0B]" />
                        </span>
                        <div className="flex-1">
                            <p className="text-[13px] font-semibold text-[#F59E0B]">
                                Complete your profile to start making payments
                            </p>
                            <p className="text-[12px] text-[#F59E0B]/60">
                                We need a few details to protect your account and detect fraud accurately.
                            </p>
                        </div>
                        <ArrowUpRight size={16} className="flex-shrink-0 text-[#F59E0B]/60" />
                    </Link>
                )}

                {/* ── Header ── */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#00E5B8]" />
                            <span className="font-mono text-[11px] uppercase tracking-widest text-white/30">
                                Customer dashboard
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            Welcome back, {firstName}
                        </h1>
                        <p className="mt-1 text-[14px] text-white/40">
                            Make a payment or review your recent transactions.
                        </p>
                    </div>

                    {profile?.profileComplete && (
                        <Link
                            to="/user/onboarding"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[13px] text-white/50 transition-all hover:bg-white/8 hover:text-white/80"
                        >
                            <MapPin size={13} />
                            Edit Home Location
                        </Link>
                    )}
                </div>

                {/* ── Stats row ── */}
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard
                        icon={CreditCard}
                        label="Total txns"
                        value="—"
                        sub="All time"
                        iconColor="text-[#00C2FF]"
                        iconBg="bg-[#00C2FF]/10"
                    />
                    <StatCard
                        icon={ShieldCheck}
                        label="Approved"
                        value="—"
                        sub="Passed instantly"
                        iconColor="text-[#00E5B8]"
                        iconBg="bg-[#00E5B8]/10"
                    />
                    <StatCard
                        icon={AlertCircle}
                        label="Flagged"
                        value="—"
                        sub="Under review"
                        iconColor="text-[#F59E0B]"
                        iconBg="bg-[#F59E0B]/10"
                    />
                    <StatCard
                        icon={XCircle}
                        label="Blocked"
                        value="—"
                        sub="Declined"
                        iconColor="text-[#EF4444]"
                        iconBg="bg-[#EF4444]/10"
                    />
                </div>

                {/* ── Two-column layout ── */}
                <div className="grid gap-6 lg:grid-cols-5">

                    {/* Left: payment form + recent transactions (3/5) */}
                    <div className="space-y-6 lg:col-span-3">

                        {/* Payment form slot */}
                        <div className="rounded-2xl border border-white/[0.08] bg-[#141D2F]">
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <CreditCard size={15} className="text-[#00C2FF]" />
                                    <span className="text-[14px] font-semibold text-white">New payment</span>
                                </div>
                                <span className="font-mono text-[11px] uppercase tracking-widest text-white/30">
                                    Secured
                                </span>
                            </div>
                            <div className="px-6 py-5">
                                <PaymentForm />
                            </div>
                        </div>

                        {/* Recent transactions */}
                        <div className="rounded-2xl border border-white/[0.08] bg-[#141D2F]">
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Clock size={15} className="text-[#00C2FF]" />
                                    <span className="text-[14px] font-semibold text-white">Recent transactions</span>
                                </div>
                                <Link
                                    to="/user/transactions"
                                    className="font-mono text-[11px] uppercase tracking-widest text-[#00C2FF]/60 transition-colors hover:text-[#00C2FF]"
                                >
                                    View all
                                </Link>
                            </div>
                            <div className="px-6 py-2">
                                {/* Placeholder rows — replace with real data */}
                                <TxnRow emoji="🛒" name="Amazon Prime" amount="$14.99" status="approved" time="Today, 9:42 AM" />
                                <TxnRow emoji="✈️" name="Qatar Airways" amount="$4,280.00" status="blocked" time="Today, 8:15 AM" />
                                <TxnRow emoji="🍔" name="Shake Shack" amount="$22.40" status="approved" time="Yesterday, 1:10 PM" />
                                <TxnRow emoji="💊" name="CVS Pharmacy" amount="$68.15" status="monitored" time="Yesterday, 11:05 AM" />
                            </div>
                        </div>
                    </div>

                    {/* Right: profile card (2/5) */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-white/[0.08] bg-[#141D2F]">
                            <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-4">
                                <User size={15} className="text-[#00C2FF]" />
                                <span className="text-[14px] font-semibold text-white">Profile</span>
                                {profile?.profileComplete ? (
                                    <span className="ml-auto flex items-center gap-1 rounded-full border border-[#00E5B8]/25 bg-[#00E5B8]/10 px-2 py-0.5 font-mono text-[10px] text-[#00E5B8]">
                                        <CheckCircle2 size={10} /> Complete
                                    </span>
                                ) : (
                                    <span className="ml-auto flex items-center gap-1 rounded-full border border-[#F59E0B]/25 bg-[#F59E0B]/10 px-2 py-0.5 font-mono text-[10px] text-[#F59E0B]">
                                        <AlertTriangle size={10} /> Incomplete
                                    </span>
                                )}
                            </div>

                            {/* Avatar */}
                            <div className="flex flex-col items-center border-b border-white/[0.06] px-5 py-6">
                                <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00C2FF]/15 text-2xl font-bold text-[#00C2FF]">
                                    {user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?"}
                                </div>
                                <p className="font-semibold text-white">{user?.name ?? "—"}</p>
                                <p className="font-mono text-[12px] text-white/40">{user?.email ?? "—"}</p>
                            </div>

                            {/* Fields */}
                            <div className="space-y-2 p-4">
                                {profile?.dob && (
                                    <ProfileField
                                        icon={Calendar}
                                        label="Date of birth"
                                        value={formatDob(profile.dob)}
                                    />
                                )}
                                {profile?.gender && (
                                    <ProfileField
                                        icon={User}
                                        label="Gender"
                                        value={formatGender(profile.gender)}
                                    />
                                )}
                                {/* {profile?.cityPop && (
                                    <ProfileField
                                        icon={Users}
                                        label="City population"
                                        value={Number(profile.cityPop).toLocaleString()}
                                    />
                                )} */}
                                {(profile?.homeLat && profile?.homeLon) && (
                                    <ProfileField
                                        icon={MapPin}
                                        label="Home location"
                                        value={formatLocation(profile.homeLat, profile.homeLon)}
                                    />
                                )}

                                {/* If nothing is filled yet */}
                                {!profile?.dob && !profile?.gender && !profile?.cityPop && !profile?.homeLat && (
                                    <div className="py-4 text-center text-[13px] text-white/25">
                                        No profile data yet
                                    </div>
                                )}
                            </div>

                            {/* Edit CTA */}
                            <div className="border-t border-white/[0.06] p-4">
                                <Link
                                    to="/user/onboarding"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-[13px] font-medium text-white/60 transition-all hover:bg-white/8 hover:text-white"
                                >
                                    <MapPin size={13} />
                                    {profile?.profileComplete ? "Edit profile" : "Complete profile"}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}