"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/http";
import { ApiErrorHandler } from "@/lib/errors";
import { extractResponseData } from "@/lib/api-utils";

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
        { plan: planId }
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
      const response = await http.get<Subscription>("/payments/stripe/subscription-status");
      return extractResponseData(response.data);
    },
  });
};

/**
 * Hook to cancel subscription
 */
export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cancelAtPeriodEnd = true) => {
      const response = await http.post("/payments/stripe/cancel-subscription", {
        cancelAtPeriodEnd,
      });
      return extractResponseData(response.data);
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
      // Amount in cents: monthly=$9.99, yearly=$99.99
      const amounts = { monthly: 999, yearly: 9999 };
      const response = await http.post("/payments/sslcommerz/init", {
        amount: amounts[planId],
        currency: "BDT",
        plan: planId,
      });
      return extractResponseData(response.data);
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
