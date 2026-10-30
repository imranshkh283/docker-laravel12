import axios from 'axios';
import { authStore } from "./lib/authStore";

const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Request interceptor — har request mein token add karega
api.interceptors.request.use((config) => {
    const token = authStore.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — 401 pe auto logout
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error);
        console.log(error.response?.status);
        if (error.response?.status === 401) {
            authStore.clear();
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
