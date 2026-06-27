import axios from "axios";

// Base URL comes from .env (VITE_API_BASE_URL). One place to change it.
const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});

// A module-level token, set by the auth context on login/logout.
// The interceptor reads it and attaches it to every outgoing request.
let authToken = null;
export function setAuthToken(token) {
    authToken = token;
}

client.interceptors.request.use((config) => {
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
});

export default client;