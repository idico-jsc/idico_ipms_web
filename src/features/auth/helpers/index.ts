import { useAuthStore } from "../store/auth-store";

/**
 * Helper to get token expiry in seconds
 */
export const getTokenExpirySeconds = (): number => {
  return import.meta.env.VITE_FRAPPE_TOKEN_EXPIRY_DAYS * 24 * 60 * 60;
};
export function handleUnauthorized(): void {
  // Clear Zustand auth state (also clears tokens)
  useAuthStore.getState().clearAuth();

  // Store current path for redirect after login (optional)
  const currentPath = window.location.pathname;
  if (currentPath !== "/login" && currentPath !== "/") {
    sessionStorage.setItem("redirectAfterLogin", currentPath);
  }

  // Redirect to login page
  // Note: Using window.location instead of router to ensure clean state
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

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
