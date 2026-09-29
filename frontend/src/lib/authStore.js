const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

export const authStore = {
    // Access token
    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    setAccessToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),

    // Refresh token
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),

    // User
    getUser: () => {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    },
    setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),

    // Save full login response
    saveSession: ({ access_token, refresh_token, data: user }) => {
        authStore.setAccessToken(access_token);
        authStore.setRefreshToken(refresh_token);
        authStore.setUser(user);
    },

    // Clear everything
    clear: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Check if logged in
    isAuthenticated: () => Boolean(authStore.getAccessToken()),
};
