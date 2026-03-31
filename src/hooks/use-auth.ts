"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { http } from "@/lib/http";
import { ApiErrorHandler } from "@/lib/errors";
import { useAsync } from "./use-async";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  role: "USER" | "ADMIN";
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: unknown | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * Custom hook for authentication management
 * Provides methods for signup, login, logout, and session handling
 */
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // Helper to update auth state after API call
  const setAuthState = useCallback(
    (session: unknown | null, isAuth: boolean = !!session) => {
      setState((prev) => ({
        ...prev,
        session,
        user: session && typeof session === "object" && "user" in session
          ? (session.user as AuthUser)
          : null,
        isAuthenticated: isAuth,
        loading: false,
        error: null,
      }));
    },
    []
  );

  // Helper to set error state
  const setAuthError = useCallback((error: string) => {
    setState((prev) => ({
      ...prev,
      loading: false,
      error,
    }));
  }, []);

  // Initialize auth state from session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const sessionToken = typeof window !== "undefined" 
          ? localStorage.getItem("session_token")
          : null;

        if (sessionToken) {
          const response = await http.get("/auth/get-session", {
            headers: { Authorization: `Bearer ${sessionToken}` },
          });
          
          if (response.data?.user) {
            setAuthState(response.data);
          }
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, [setAuthState]);

  // Sign up with email and password
  const signup = useCallback(
    async (email: string, password: string, name: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await http.post("/auth/sign-up/email", {
          email,
          password,
          name,
        });

        if (response.data?.data?.user && response.data?.data?.session) {
          const userData = response.data.data;
          if (typeof window !== "undefined") {
            localStorage.setItem("session_token", userData.session.id);
          }
          setAuthState(userData);
          return userData;
        }

        throw new Error("Sign up failed");
      } catch (error) {
        const message = ApiErrorHandler.getErrorMessage(error);
        setAuthError(message);
        throw error;
      }
    },
    [setAuthState, setAuthError]
  );

  // Generic OTP handler
  const handleOTP = useCallback(
    async (endpoint: string, payload: Record<string, string>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await http.post(endpoint, payload);
        setState((prev) => ({ ...prev, loading: false, error: null }));
        return response.data;
      } catch (error) {
        const message = ApiErrorHandler.getErrorMessage(error);
        setAuthError(message);
        throw error;
      }
    },
    [setAuthError]
  );

  // Send OTP to email
  const sendOTP = useCallback(
    (email: string) => handleOTP("/auth/send-otp", { email }),
    [handleOTP]
  );

  // Verify OTP
  const verifyOTP = useCallback(
    (email: string, otp: string) =>
      handleOTP("/auth/verify-otp", { email, otp }),
    [handleOTP]
  );

  // Resend OTP (same as sendOTP)
  const resendOTP = useCallback(
    (email: string) => handleOTP("/auth/send-otp", { email }),
    [handleOTP]
  );

  // Login with email and password
  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await http.post("/auth/sign-in/email", {
          email,
          password,
        });

        if (response.data?.data?.user && response.data?.data?.session) {
          const userData = response.data.data;
          if (typeof window !== "undefined") {
            localStorage.setItem("session_token", userData.session.id);
          }
          setAuthState(userData);
          return userData;
        }

        throw new Error("Login failed");
      } catch (error) {
        const message = ApiErrorHandler.getErrorMessage(error);
        setAuthError(message);
        throw error;
      }
    },
    [setAuthState, setAuthError]
  );

  // Logout
  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      localStorage.removeItem("session_token");

      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error) {
      const message = ApiErrorHandler.getErrorMessage(error);
      setAuthError(message);
    }
  }, [setAuthError]);

  // Get current session token
  const getSessionToken = useCallback(() => {
    return typeof window !== "undefined"
      ? localStorage.getItem("session_token")
      : null;
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    user: state.user,
    session: state.session,
    loading: state.loading,
    error: state.error,

    // Methods
    signup,
    login,
    logout,
    sendOTP,
    verifyOTP,
    resendOTP,
    getSessionToken,
    clearError,

    // Convenience properties
    isAuthenticated: state.isAuthenticated && !!state.user,
    isAdmin: state.user?.role === "ADMIN",
    isEmailVerified: state.user?.emailVerified ?? false,
  };
};

export default useAuth;
