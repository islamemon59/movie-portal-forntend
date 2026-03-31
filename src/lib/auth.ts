import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import BetterSqlite3 from "better-sqlite3";

const database = new BetterSqlite3("./auth.db");

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:3000/api/auth",
  basePath: "/api/auth",
  secret: process.env.AUTH_SECRET || "dev-secret-key-change-in-production",
  database,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
  advanced: {
    crossSubdomainCookies: {
      enabled: false,
    },
  },
});
