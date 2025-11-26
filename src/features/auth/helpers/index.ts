import { useAuthStore } from "../store/auth-store";
import { FRAPPE_TOKEN_EXPIRY_DAYS } from "@/constants/env";

/**
 * Helper to get token expiry in seconds
 */
export const getTokenExpirySeconds = (): number => {
  return FRAPPE_TOKEN_EXPIRY_DAYS * 24 * 60 * 60;
};

/**
 * Get the redirect path after successful login
 * @returns The stored redirect path or null
 */
export function getRedirectAfterLogin(): string | null {
  const path = sessionStorage.getItem("redirectAfterLogin");
  if (path) {
    sessionStorage.removeItem("redirectAfterLogin");
    return path;
  }
  return null;
}

/**
 * Check if user is authenticated
 * Checks both token and Zustand store state
 * @returns True if user is authenticated
 */
export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated;
}
