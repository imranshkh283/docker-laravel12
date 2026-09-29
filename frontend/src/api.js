import axios from 'axios';
import { authStore } from "./lib/authStore";

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ============================================
// Request interceptor — attach access token
// ============================================
api.interceptors.request.use((config) => {
    const token = authStore.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ============================================
// Response interceptor — auto-refresh on 401
// ============================================

// Track if a refresh is already in progress
let isRefreshing = false;
// Queue of failed requests waiting for new token
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If not 401, or already retried, or this IS the refresh endpoint — bail out
        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url?.includes("/refresh") ||
            originalRequest.url?.includes("/login")
        ) {
            return Promise.reject(error);
        }

        // If already refreshing — queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = authStore.getRefreshToken();

            if (!refreshToken) {
                throw new Error("No refresh token");
            }

            // Call /refresh with refresh token
            const { data } = await axios.post(
                "http://127.0.0.1:8000/api/v1/refresh",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                        Accept: "application/json",
                    },
                }
            );

            // Save new access token
            authStore.setAccessToken(data.access_token);

            // Notify all queued requests
            processQueue(null, data.access_token);

            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            return api(originalRequest);
        } catch (refreshError) {
            // Refresh failed — logout
            processQueue(refreshError, null);
            authStore.clear();
            window.location.href = "/login";
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
