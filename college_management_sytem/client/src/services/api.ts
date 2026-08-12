import axios from "axios";

const getBaseUrl = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");
  return envUrl.endsWith("/api") ? envUrl : `${envUrl}/api`;
};

// Single Centralized Axios Instance
const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
          window.dispatchEvent(new CustomEvent("cms_unauthorized"));
        }
      } else if (status === 403) {
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/unauthorized")) {
          window.location.href = "/unauthorized";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
