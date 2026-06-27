import AppNavbar from "../components/AppNavbar";

export default function CustomerDashboard() {
    return (
        <div className="min-h-screen bg-bg">
            <AppNavbar />

            <main className="mx-auto max-w-2xl p-6">
                <h1 className="mb-2 text-2xl font-bold">Welcome back</h1>
                <p className="mb-6 text-text-muted">
                    Make a payment or review your recent transactions.
                </p>
                <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center text-text-muted">
                    Payment form coming next
                </div>
            </main>
        </div>
    );
}