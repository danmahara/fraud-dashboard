import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const location = useLocation();
    const justRegistered = location.state?.registered;

    function handleSubmit(e) {
        e.preventDefault();
        loginMutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    login(data.token);
                    navigate("/home"); // RoleRedirect routes ADMIN vs USER
                },
            }
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg px-4">
            {/* Vertical column: banner stacks ABOVE the card */}
            <div className="flex w-full max-w-sm flex-col gap-4">
                {justRegistered && (
                    <div className="rounded-lg bg-risk-green/10 px-3 py-2 text-center text-sm text-risk-green">
                        Account created. Please log in.
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-8 shadow-sm"
                >
                    <h1 className="text-xl font-bold">FraudGuard</h1>
                    <p className="text-sm text-text-muted">Sign in to your account</p>

                    <input
                        className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
                    >
                        {loginMutation.isPending ? "Signing in…" : "Sign in"}
                    </button>

                    {loginMutation.isError && (
                        <div className="text-sm text-risk-red">
                            Login failed — check your email and password.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}