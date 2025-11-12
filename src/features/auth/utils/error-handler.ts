import { toast } from "sonner";
import { FrappeError } from "@/types";

/**
 * Auth Error Handler
 *
 * Centralized error handling for authentication-related errors.
 * Provides consistent error messages and user feedback.
 */

/**
 * Handle authentication errors with appropriate user feedback
 *
 * @param error - The error object (typically FrappeError)
 * @param t - Translation function from i18next (any TFunction)
 * @param fallbackHandler - Optional fallback for unhandled errors
 */
export function handleAuthError(
  error: unknown,
  t: any, // Accept any translation function to avoid type conflicts
  fallbackHandler?: (error: any) => any
): void {
  // Type guard for FrappeError
  const frappeError = error as FrappeError;

  // Handle authentication errors
  if (frappeError?.exc_type === "AuthenticationError") {
    toast.error(t("error.invalid_credentials.title"), {
      description: t("error.invalid_credentials.message"),
    });
    return;
  }

  // Handle security exceptions (account locked, rate limited, etc.)
  if (frappeError?.exc_type === "SecurityException") {
    toast.error(t("error.login_locked.title"), {
      description: t("error.login_locked.message"),
    });
    return;
  }

  // Handle permission errors
  if (frappeError?.exc_type === "PermissionError") {
    toast.error(t("error.unauthorized.title"), {
      description: t("error.unauthorized.message"),
    });
    return;
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    toast.error(t("error.network.title"), {
      description: t("error.network.message"),
    });
    return;
  }

  // Fallback to provided handler or generic error
  if (fallbackHandler) {
    fallbackHandler(error);
  } else {
    // Generic error message
    const errorMessage =
      error instanceof Error ? error.message : t("error.general.message");

    toast.error(t("error.general.title"), {
      description: errorMessage,
    });
  }
}

/**
 * Check if error is an authentication-related error
 */
export function isAuthError(error: unknown): boolean {
  const frappeError = error as FrappeError;
  return (
    frappeError?.exc_type === "AuthenticationError" ||
    frappeError?.exc_type === "SecurityException" ||
    frappeError?.exc_type === "PermissionError"
  );
}
