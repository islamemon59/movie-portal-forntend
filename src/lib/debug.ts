/**
 * Development utilities for debugging API interactions
 * Only used in development mode
 */

export const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Log API request details
 */
export function logApiRequest(
  method: string,
  url: string,
  data?: unknown,
  headers?: Record<string, string>
) {
  if (!isDevelopment) return;

  console.group(`🔗 API Request [${method}]`);
  console.log("URL:", url);
  if (data) console.log("Data:", data);
  if (headers) console.log("Headers:", headers);
  console.groupEnd();
}

/**
 * Log API response details
 */
export function logApiResponse(
  method: string,
  url: string,
  status: number,
  data?: unknown
) {
  if (!isDevelopment) return;

  const icon = status >= 400 ? "❌" : "✅";
  console.group(`${icon} API Response [${method} ${status}]`);
  console.log("URL:", url);
  console.log("Data:", data);
  console.groupEnd();
}

/**
 * Log API error details
 */
export function logApiError(
  method: string,
  url: string,
  error: unknown,
  requestId?: string
) {
  if (!isDevelopment) return;

  console.group("❌ API Error");
  console.log("Method:", method);
  console.log("URL:", url);
  console.error("Error:", error);
  if (requestId) console.log("Request ID:", requestId);
  console.groupEnd();
}

/**
 * Log authentication event
 */
export function logAuthEvent(event: string, data?: unknown) {
  if (!isDevelopment) return;

  console.group(`🔐 Auth Event: ${event}`);
  if (data) console.log("Data:", data);
  console.groupEnd();
}

/**
 * Get all stored data for debugging
 */
export function getStorageDebugInfo() {
  if (typeof window === "undefined") return null;

  return {
    localStorage: {
      sessionToken: localStorage.getItem("session_token") ? "SET" : "NOT SET",
      allKeys: Object.keys(localStorage),
    },
    sessionStorage: {
      allKeys: Object.keys(sessionStorage),
    },
  };
}

/**
 * Clear all authentication data
 */
export function clearAuthData() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("session_token");
  console.log("🧹 Auth data cleared");
}

/**
 * Log current auth state
 */
export function logAuthState(state: unknown) {
  if (!isDevelopment) return;

  console.group("🔐 Auth State");
  console.log(state);
  console.groupEnd();
}
