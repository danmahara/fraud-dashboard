import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("test@example.com");
    const [password, setPassword] = useState("password123");

    const { login } = useAuth();
    const navigate = useNavigate();
    const loginMutation = useLogin();

    function handleSubmit(e) {
        e.preventDefault();
        loginMutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    login(data.token);     // store token in context
                    navigate("/dashboard"); // go to the feed
                },
            }
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-text">
            <form
                onSubmit={handleSubmit}
                className="flex w-80 flex-col gap-3 rounded-xl bg-surface p-8 shadow-xl"
            >
                <h1 className="text-xl font-bold">Fraud Monitor</h1>
                <p className="text-sm text-text-muted">Admin sign in</p>

                <input
                    className="rounded-lg border border-border px-3 py-2 text-sm"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="rounded-lg border border-border px-3 py-2 text-sm"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
    );
}