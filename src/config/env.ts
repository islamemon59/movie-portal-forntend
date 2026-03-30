import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3001"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:3000/api/v1"),
  NEXT_PUBLIC_AUTH_BASE_URL: z.string().url().default("http://localhost:3000/api/auth"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
});
