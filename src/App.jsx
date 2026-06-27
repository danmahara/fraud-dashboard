import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:8080";
const POLL_MS = 4000; // refresh the feed every 4 seconds

// Map each risk level to a colour for the row accent + badge.
const RISK_COLORS = {
  GREEN: "#16a34a",
  YELLOW: "#ca8a04",
  ORANGE: "#ea580c",
  RED: "#dc2626",
};

export default function App() {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [loginError, setLoginError] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [feedError, setFeedError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // --- Login: get a JWT and keep it in memory ---
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setLoginError("Login failed — check email/password.");
        return;
      }
      const data = await res.json();
      setToken(data.token);
    } catch {
      setLoginError("Could not reach the server. Is Spring running?");
    }
  }

  // --- Fetch the recent transactions feed ---
  const fetchFeed = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/admin/transactions?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        setFeedError("Not authorised — is this an ADMIN account?");
        return;
      }
      if (!res.ok) {
        setFeedError(`Server error (${res.status}).`);
        return;
      }
      setTransactions(await res.json());
      setFeedError("");
      setLastUpdated(new Date());
    } catch {
      setFeedError("Lost connection to the server.");
    }
  }, [token]);

  // --- Poll while logged in ---
  useEffect(() => {
    if (!token) return;
    fetchFeed(); // immediate first load
    const id = setInterval(fetchFeed, POLL_MS);
    return () => clearInterval(id); // stop polling on logout/unmount
  }, [token, fetchFeed]);

  // ---------- Login screen ----------
  if (!token) {
    return (
      <div style={styles.centered}>
        <form onSubmit={handleLogin} style={styles.loginCard}>
          <h1 style={styles.loginTitle}>Fraud Monitor</h1>
          <p style={styles.loginSub}>Admin sign in</p>
          <input
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />
          <input
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <button style={styles.button} type="submit">Sign in</button>
          {loginError && <div style={styles.error}>{loginError}</div>}
        </form>
      </div>
    );
  }

  // ---------- Dashboard ----------
  const flagged = transactions.filter((t) =>
    ["ORANGE", "RED"].includes(t.riskLevel)
  ).length;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.h1}>Fraud Monitor — Live Feed</h1>
          <span style={styles.meta}>
            {transactions.length} transactions · {flagged} flagged
            {lastUpdated && ` · updated ${lastUpdated.toLocaleTimeString()}`}
          </span>
        </div>
        <button style={styles.logout} onClick={() => setToken(null)}>
          Sign out
        </button>
      </header>

      {feedError && <div style={styles.banner}>{feedError}</div>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Risk</th>
            <th style={styles.th}>Amount</th>
            <th style={styles.th}>Merchant</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Channel</th>
            <th style={styles.th}>Decision</th>
            <th style={styles.th}>Score</th>
            <th style={styles.th}>Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => {
            const color = RISK_COLORS[t.riskLevel] || "#6b7280";
            return (
              <tr key={t.id} style={{ borderLeft: `4px solid ${color}` }}>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: color }}>
                    {t.riskLevel}
                  </span>
                </td>
                <td style={styles.td}>${Number(t.amount).toFixed(2)}</td>
                <td style={styles.td}>{t.merchant}</td>
                <td style={styles.td}>{t.merchantCategory}</td>
                <td style={styles.td}>{t.channel}</td>
                <td style={styles.td}>{t.status}</td>
                <td style={styles.td}>
                  {t.fraudScore != null ? t.fraudScore.toFixed(4) : "—"}
                </td>
                <td style={styles.tdMuted}>
                  {new Date(t.transactionTime).toLocaleString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  centered: {
    display: "flex", minHeight: "100vh", alignItems: "center",
    justifyContent: "center", background: "#0f172a", fontFamily: "system-ui"
  },
  loginCard: {
    background: "#fff", padding: 32, borderRadius: 12, width: 320,
    display: "flex", flexDirection: "column", gap: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
  },
  loginTitle: { margin: 0, fontSize: 22 },
  loginSub: { margin: 0, color: "#64748b", fontSize: 14 },
  input: { padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14 },
  button: {
    padding: 10, border: "none", borderRadius: 8, background: "#2563eb",
    color: "#fff", fontSize: 15, cursor: "pointer"
  },
  error: { color: "#dc2626", fontSize: 13 },
  page: {
    fontFamily: "system-ui", background: "#f1f5f9", minHeight: "100vh",
    padding: 24
  },
  header: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16
  },
  h1: { margin: 0, fontSize: 22, color: "#0f172a" },
  meta: { color: "#64748b", fontSize: 13 },
  logout: {
    padding: "8px 14px", border: "1px solid #cbd5e1", borderRadius: 8,
    background: "#fff", cursor: "pointer"
  },
  banner: {
    background: "#fef2f2", color: "#dc2626", padding: 10,
    borderRadius: 8, marginBottom: 12, fontSize: 14
  },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 4px" },
  th: {
    textAlign: "left", fontSize: 12, textTransform: "uppercase",
    color: "#64748b", padding: "4px 10px"
  },
  td: { background: "#fff", padding: "10px", fontSize: 14 },
  tdMuted: { background: "#fff", padding: "10px", fontSize: 13, color: "#64748b" },
  badge: {
    color: "#fff", padding: "2px 8px", borderRadius: 999, fontSize: 12,
    fontWeight: 600
  },
};