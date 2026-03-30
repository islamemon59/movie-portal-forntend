import { loadStripe } from "@stripe/stripe-js";
import { env } from "@/config/env";

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export function getStripe() {
  if (!env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  }

  stripePromise ??= loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  return stripePromise;
}
