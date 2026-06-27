import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { setAuthToken } from "../api/client";

const AuthContext = createContext(null);

// Decode the payload (middle part) of a JWT to read its claims.
// No verification here — that's the server's job; we just read sub/role/exp.
function decodeToken(token) {
    try {
        const payload = token.split(".")[1];
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => sessionStorage.getItem("token"));

    useEffect(() => {
        setAuthToken(token);
        if (token) sessionStorage.setItem("token", token);
        else sessionStorage.removeItem("token");
    }, [token]);

    // Derive the user object from the token. useMemo so it only recomputes
    // when the token actually changes.
    const user = useMemo(() => {
        if (!token) return null;
        const claims = decodeToken(token);
        if (!claims) return null;
        return {
            name: claims.name,
            email: claims.sub,                       // we set the email as the subject
            role: claims.role,                       // the "role" claim, if present
        };
    }, [token]);

    const value = {
        token,
        user,
        isAuthenticated: !!token,
        login: (newToken) => setToken(newToken),
        logout: () => setToken(null),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}