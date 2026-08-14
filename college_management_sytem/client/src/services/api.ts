import axios from "axios";

declare const process: any;

const getBaseUrl = (): string => {
  let envUrl = "";
  if (typeof process !== "undefined" && process?.env?.NEXT_PUBLIC_API_URL) {
    envUrl = process.env.NEXT_PUBLIC_API_URL;
  } else if (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env.NEXT_PUBLIC_API_URL) {
    envUrl = (import.meta as any).env.NEXT_PUBLIC_API_URL;
  }
  envUrl = (envUrl || "http://localhost:5000").replace(/\/+$/, "");
  return envUrl.endsWith("/api") ? envUrl.slice(0, -4) : envUrl;
};

// Single Centralized Axios Instance
const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to ensure all endpoints have /api prefix without duplicating
api.interceptors.request.use((config) => {
  if (config.url && !config.url.startsWith("http://") && !config.url.startsWith("https://")) {
    if (!config.url.startsWith("/api/") && config.url !== "/api") {
      config.url = `/api${config.url.startsWith("/") ? "" : "/"}${config.url}`;
    }
  }
  return config;
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
