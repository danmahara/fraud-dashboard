import client from "./client";

// POST /api/auth/login -> { token, ... }
export async function login(email, password) {
    const { data } = await client.post("/api/auth/login", { email, password });
    return data;
}

// GET /api/admin/transactions?limit=... -> AdminTransactionView[]
export async function getRecentTransactions(limit = 50) {
    const { data } = await client.get("/api/admin/transactions", {
        params: { limit },
    });
    return data;
}


// GET /api/admin/stats -> aggregate stats for the analytics page
export async function getStats() {
    const { data } = await client.get("/api/admin/stats");
    return data;
}