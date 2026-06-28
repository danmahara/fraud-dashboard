import client from "./client";

// Admin merchants
export async function getAdminMerchants() {
    const { data } = await client.get("/api/admin/merchants");
    return data;
}

export async function getAdminCategories() {
    const { data } = await client.get("/api/admin/categories");
    return data;
}

export async function createMerchant(payload) {
    const { data } = await client.post("/api/admin/merchants", payload);
    return data;
}

export async function updateMerchant(id, payload) {
    const { data } = await client.put(`/api/admin/merchants/${id}`, payload);
    return data;
}