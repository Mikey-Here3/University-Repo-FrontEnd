import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://university-repo-backend-production.up.railway.app/api/v1",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Rate limited
    if (status === 429) {
      console.warn("Rate limited — backing off");
      // Don't clear auth on rate limit, just reject
      return Promise.reject(error);
    }

    // Unauthorized — token expired
    if (status === 401) {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

      // Only clear auth if NOT on login/register page
      // This prevents clearing auth during login attempt errors
      if (currentPath !== "/login" && currentPath !== "/register") {
        useAuthStore.getState().clearAuth();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;