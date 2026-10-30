import { authStore } from '../lib/authStore';

export function useAuth() {

    const user = authStore.getUser();
    const token = authStore.getAccessToken();

    return {
        user,
        userId: user?.id ?? null,
        role: user?.role ?? null,
        isAuthenticated: !!token,
        logout: () => {
            authStore.clear();
            window.location.href = "/login";
        },
    };
}
