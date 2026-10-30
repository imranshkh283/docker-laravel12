// src/store/authStore.js

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";

export const authStore = {
    // ---------- Token ----------
    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),

    setAccessToken: (token) => {
        if (!token || token === "undefined" || token === "null") {
            console.warn("[authStore] Attempted to save empty/invalid token");
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            return;
        }
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    // ---------- User ----------
    getUser: () => {
        try {
            const stored = localStorage.getItem(USER_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            localStorage.removeItem(USER_KEY);
            return null;
        }
    },

    setUser: (user) => {
        if (!user) {
            localStorage.removeItem(USER_KEY);
            return;
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    // ---------- Session ----------
    saveSession: (result) => {
        // Laravel returns { data: user, extra: { token } }  OR  { data: user, token }
        const token = result?.extra?.token ?? result?.token ?? null;
        const user = result?.data ?? result?.user ?? null;

        if (!token) {
            console.error("[authStore] No token found in login response:", result);
            return;
        }

        authStore.setAccessToken(token);
        authStore.setUser(user);
    },

    // ---------- Clear ----------
    clear: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // ---------- Helpers ----------
    isAuthenticated: () => Boolean(authStore.getAccessToken()),
    getUserId: () => authStore.getUser()?.id ?? null,
    getRole: () => authStore.getUser()?.role ?? null,
};
