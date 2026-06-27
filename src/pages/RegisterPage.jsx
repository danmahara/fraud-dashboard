import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useRegister } from "../hooks/useAuth";

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const navigate = useNavigate();
    const registerMutation = useRegister();

    // Update one field by name.
    function update(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        registerMutation.mutate(form, {
            onSuccess: () => {
                // Account created — send them to login with a success flag.
                navigate("/login", { state: { registered: true } });
            },
        });
    }

    // Pull the server's error message (e.g. "Email already registered").
    const errorMessage =
        registerMutation.error?.response?.data?.message ||
        (registerMutation.isError ? "Something went wrong. Please try again." : "");

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg px-4">
            <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
                <div className="mb-6 text-center">
                    <div className="mb-3 inline-flex rounded-xl bg-primary-light p-3 text-primary">
                        <ShieldCheck size={24} />
                    </div>
                    <h1 className="text-2xl font-bold">Create your account</h1>
                    <p className="mt-1 text-sm text-text-muted">
                        Open an account to start making protected payments.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Field label="Full name">
                        <input
                            name="name"
                            value={form.name}
                            onChange={update}
                            required
                            className={inputClass}
                            placeholder="Jane Smith"
                        />
                    </Field>

                    <Field label="Email">
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={update}
                            required
                            className={inputClass}
                            placeholder="jane@example.com"
                        />
                    </Field>

                    <Field label="Phone">
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={update}
                            required
                            className={inputClass}
                            placeholder="9800000000"
                        />
                    </Field>

                    <Field label="Password">
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={update}
                            required
                            minLength={6}
                            className={inputClass}
                            placeholder="At least 6 characters"
                        />
                    </Field>

                    {errorMessage && (
                        <div className="rounded-lg bg-risk-red/10 px-3 py-2 text-sm text-risk-red">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="mt-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-primary-dark disabled:opacity-60"
                    >
                        {registerMutation.isPending ? "Creating account…" : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

// Small labelled-field wrapper.
function Field({ label, children }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">{label}</span>
            {children}
        </label>
    );
}

const inputClass =
    "rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

// export default RegisterPage;