
const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";

export const authStore = {

    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),

    setAccessToken: (token) =>
        localStorage.setItem(ACCESS_TOKEN_KEY, token),

    getUser: () => {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    },

    setUser: (user) =>
        localStorage.setItem(USER_KEY, JSON.stringify(user)),

    saveSession: (result) => {

        authStore.setAccessToken(result.token);
        authStore.setUser(result.data);
    },

    clear: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    isAuthenticated: () => Boolean(authStore.getAccessToken()),
};
