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
        const { data: session } = await authClient.getSession();
        setAuthState(session, !!session);
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
        const response = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (response.error) {
          throw new Error(response.error.message || "Sign up failed");
        }

        const { data: session } = await authClient.getSession();
        setAuthState(session);

        return response.data;
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
        const response = await authClient.signIn.email({
          email,
          password,
        });

        if (response.error) {
          throw new Error(response.error.message || "Login failed");
        }

        const { data: session } = await authClient.getSession();
        setAuthState(session);

        return response.data;
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
      await authClient.signOut();
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
