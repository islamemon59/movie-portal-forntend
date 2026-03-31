import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
  basePath: "/api/auth",
  secret: process.env.AUTH_SECRET || "your-secret-key-change-in-production",
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
  ],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    nextCookies(),
  ],
  database: {
    provider: "sqlite",
    path: "./auth.db",
  },
});
