import axios, { AxiosError, AxiosInstance } from "axios";
import { env } from "@/config/env";

export const http: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 20_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach session token if available
http.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("session_token")
    : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor: handle common errors
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("session_token");
        // Optionally redirect to login
        // window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error("Access denied");
    }

    // Handle 429 Rate Limited
    if (error.response?.status === 429) {
      console.error("Rate limited - too many requests");
    }

    return Promise.reject(error);
  }
);

export default http;
