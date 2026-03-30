"use client";

import { useCallback, useState } from "react";
import { ApiErrorHandler } from "@/lib/errors";

export interface UseAsyncState {
  loading: boolean;
  error: string | null;
}

/**
 * Generic async operation hook
 * Reduces boilerplate for loading/error state management
 */
export function useAsync<T, Args extends unknown[]>(
  asyncFn: (...args: Args) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  }
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const data = await asyncFn(...args);
        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const message = ApiErrorHandler.getErrorMessage(err);
        setError(message);
        options?.onError?.(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn, options]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
  };
}

/**
 * Hook for managing state with loading/error
 */
export function useAsyncState<T, Args extends unknown[]>(
  asyncFn: (...args: Args) => Promise<T>,
  initialValue?: T
) {
  const [data, setData] = useState<T | undefined>(initialValue);
  const { loading, error, execute, clearError } = useAsync(asyncFn, {
    onSuccess: setData,
  });

  return {
    data,
    loading,
    error,
    execute,
    clearError,
    setData,
  };
}
