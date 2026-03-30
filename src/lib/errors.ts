import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: Record<string, any>;
  timestamp?: string;
  requestId?: string;
}

export class ApiErrorHandler {
  static getErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const data = error.response?.data as any;

      // Structured error response from backend
      if (data?.error?.message) {
        return data.error.message;
      }

      // Generic status code messages
      switch (status) {
        case 400:
          return "Invalid request. Please check your input.";
        case 401:
          return "Please log in again.";
        case 403:
          return "You do not have permission to access this.";
        case 404:
          return "Resource not found.";
        case 429:
          return "Too many requests. Please try again later.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return error.message || "Something went wrong. Please try again.";
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "An unexpected error occurred.";
  }

  static getApiError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      const data = error.response?.data as any;

      return {
        message: this.getErrorMessage(error),
        statusCode: error.response?.status || 500,
        code: data?.error?.code,
        details: data?.error?.details,
        timestamp: data?.error?.timestamp,
        requestId: data?.error?.requestId,
      };
    }

    return {
      message: this.getErrorMessage(error),
      statusCode: 500,
    };
  }

  static isUnauthorized(error: unknown): boolean {
    return error instanceof AxiosError && error.response?.status === 401;
  }

  static isForbidden(error: unknown): boolean {
    return error instanceof AxiosError && error.response?.status === 403;
  }

  static isNotFound(error: unknown): boolean {
    return error instanceof AxiosError && error.response?.status === 404;
  }

  static isValidationError(error: unknown): boolean {
    return error instanceof AxiosError && error.response?.status === 400;
  }
}

export default ApiErrorHandler;
