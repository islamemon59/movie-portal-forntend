"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { ApiErrorHandler } from "@/lib/errors";

export interface StripeSession {
  sessionId: string;
  url: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeId: string;
  plan: string;
  status: "ACTIVE" | "CANCELED" | "PAST_DUE";
  currentPeriodEnd: string;
  createdAt: string;
}

/**
 * Hook to create Stripe checkout session
 */
export const useStripeCheckout = () => {
  return useMutation({
    mutationFn: async (planId: "monthly" | "yearly") => {
      const response = await http.post<StripeSession>(
        "/payments/stripe/create-checkout-session",
        { planId }
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      console.error(
        "Payment initialization failed:",
        ApiErrorHandler.getErrorMessage(error)
      );
    },
  });
};

/**
 * Hook to get user subscription status
 */
export const useSubscriptionStatus = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const response = await http.get<Subscription>("/payments/subscription-status");
      return response.data;
    },
  });
};

/**
 * Hook to cancel subscription
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await http.post("/payments/cancel-subscription");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });
};

/**
 * Hook to initialize SSL Commerce payment
 */
export const useSSLCommerceCheckout = () => {
  return useMutation({
    mutationFn: async (planId: "monthly" | "yearly") => {
      const response = await http.post("/payments/sslcommerz/init", { planId });
      return response.data;
    },
    onSuccess: (data) => {
      // SSL Commerce should return a redirect URL
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
    onError: (error) => {
      console.error(
        "SSL Commerce payment failed:",
        ApiErrorHandler.getErrorMessage(error)
      );
    },
  });
};

/**
 * Hook to get payment history
 */
export const usePaymentHistory = () => {
  return useQuery({
    queryKey: ["paymentHistory"],
    queryFn: async () => {
      const response = await http.get("/users/me/purchases");
      return response.data.data || response.data;
    },
  });
};
