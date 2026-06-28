import client from "./client";

// POST /api/auth/login -> { token, ... }
export async function login(email, password) {
    const { data } = await client.post("/api/auth/login", { email, password });
    return data;
}

// POST /api/auth/register -> { userId, email, message }
export async function register(payload) {
    const { data } = await client.post("/api/auth/register", payload);
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


export async function getAdminTransactionsPage(page = 0, size = 20) {
    const { data } = await client.get("/api/admin/transactions/page", {
        params: { page, size },
    });
    return data;
}


// GET /api/admin/users -> list of all users
export async function getAdminUsers() {
    const { data } = await client.get("/api/admin/users");
    return data;
}

// GET /api/admin/users/{id} -> one user's full detail
export async function getAdminUserDetail(id) {
    const { data } = await client.get(`/api/admin/users/${id}`);
    return data;
}


// ###### user endpoints ######

// GET /api/profile/me -> the logged-in user's profile + completeness flag
export async function getMyProfile() {
    const { data } = await client.get("/api/profile/me");
    return data;
}

// PUT /api/profile/me -> update the logged-in user's profile
export async function updateMyProfile(payload) {
    const { data } = await client.put("/api/profile/me", payload);
    return data;
}


// GET /api/me/accounts -> the logged-in user's accounts
export async function getMyAccounts() {
    const { data } = await client.get("/api/me/accounts");
    return data;
}

// GET /api/merchants -> active merchants for the payment dropdown
export async function getMerchants() {
    const { data } = await client.get("/api/merchants");
    return data;
}

// POST /api/transactions -> create a payment, returns the decision
export async function createTransaction(payload) {
    const { data } = await client.post("/api/transactions", payload);
    return data;
}



// GET /api/me/stats -> this user's transaction totals
export async function getMyStats() {
    const { data } = await client.get("/api/me/stats");
    return data;
}

// GET /api/me/transactions -> this user's recent transactions
export async function getMyTransactions(limit = 10) {
    const { data } = await client.get("/api/me/transactions", { params: { limit } });
    return data;
}


// GET /api/me/transactions/page -> paginated transactions
export async function getMyTransactionsPage(page = 0, size = 10) {
    const { data } = await client.get("/api/me/transactions/page", {
        params: { page, size },
    });
    return data;
}