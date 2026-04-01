import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api",
  withCredentials: true, // sends HTTP-only cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Stubbed for now — when auth is implemented, attach token here if not
// using HTTP-only cookies (keep this ready, just uncomment later)

apiClient.interceptors.request.use(
  (config) => {
    // const token = useAuthStore.getState().token
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    // 409 → version conflict — caught globally, uiStore will handle the modal
    if (status === 409) {
      // Import lazily to avoid circular dependency
      import("@/stores/uiStore").then(({ useUiStore }) => {
        useUiStore.getState().setConflictDetected(true);
      });
    }

    // 401 → unauthorized — redirect to login when auth is implemented
    if (status === 401) {
      // window.location.href = '/login'
    }

    return Promise.reject(error);
  },
);

export default apiClient;
