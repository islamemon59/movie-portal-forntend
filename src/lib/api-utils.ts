/**
 * Reusable utilities for common patterns
 */

import { AxiosError } from "axios";
import { ApiErrorHandler } from "./errors";

/**
 * Generic async action handler for state management
 * Reduces boilerplate for API calls with loading/error states
 */
export async function handleAsyncAction<T>(
  action: () => Promise<T>,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await action();
    onSuccess?.(data);
    return { success: true, data };
  } catch (error) {
    const errorMessage = ApiErrorHandler.getErrorMessage(error);
    onError?.(errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Build query string from params object
 * Skips falsy values and handles arrays
 */
export function buildQueryString(
  params?: Record<string, unknown>
): URLSearchParams {
  const query = new URLSearchParams();

  if (!params) return query;

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, String(v)));
      } else {
        query.append(key, String(value));
      }
    }
  });

  return query;
}

/**
 * Extract data from API response safely
 * Handles both { data: {...} } and raw data responses
 */
export function extractResponseData<T>(response: unknown): T {
  // Check if response is an object with data property
  if (
    response !== null &&
    typeof response === "object" &&
    "data" in response &&
    response.data !== undefined
  ) {
    return response.data as T;
  }
  // Otherwise use the response itself
  return response as T;
}

/**
 * Check if error is of specific HTTP status
 */
export function hasHttpStatus(error: unknown, status: number): boolean {
  return (
    error instanceof AxiosError && error.response?.status === status
  );
}

/**
 * Check if error is unauthorized (401)
 */
export function isUnauthorizedError(error: unknown): boolean {
  return hasHttpStatus(error, 401);
}

/**
 * Check if error is forbidden (403)
 */
export function isForbiddenError(error: unknown): boolean {
  return hasHttpStatus(error, 403);
}

/**
 * Check if error is not found (404)
 */
export function isNotFoundError(error: unknown): boolean {
  return hasHttpStatus(error, 404);
}

/**
 * Check if error is validation error (400)
 */
export function isValidationError(error: unknown): boolean {
  return hasHttpStatus(error, 400);
}

/**
 * Format error for display
 */
export function formatError(error: unknown): string {
  return ApiErrorHandler.getErrorMessage(error);
}
