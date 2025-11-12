import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/auth-store";
import { FrappeError } from "@/types";
import { toast } from "sonner";
import { useError } from "@/hooks";

/**
 * Auth Hook
 *
 * Provides authentication functionality using Zustand store
 * - Login/logout
 * - User state management (FrappeUser)
 * - Loading and error states
 * - User data stored in memory only (NOT localStorage)
 */
export function useAuth() {
  // Get state and actions from Zustand store
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loginAction = useAuthStore((state) => state.login);
  const logoutAction = useAuthStore((state) => state.logout);

  const { t } = useTranslation("messages");
  const { handleError } = useError();

  // Login wrapper
  const login = async (email: string, password: string) => {
    try {
      await loginAction(email, password);
    } catch (error) {
      // Type guard for FrappeError
      const frappeError = error as FrappeError;

      // Rethrow with translated message
      if (frappeError?.exc_type === "AuthenticationError") {
        toast.error(t("error.invalid_credentials.title"), {
          description: t("error.invalid_credentials.message"),
        });
        return;
      }
      if (frappeError?.exc_type === "SecurityException") {
        toast.error(t("error.login_locked.title"), {
          description: t("error.login_locked.message"),
        });
        return;
      }
      handleError(frappeError);
    }
  };

  // Logout wrapper with redirect
  const logout = async () => {
    try {
      await logoutAction();
    } catch (error) {
      // Even if logout API fails, we still redirect (token is cleared)
      console.error("Logout error:", error);
    }
    // Redirect to login page using window.location for clean state reset
    window.location.href = "/login";
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated,
  };
}
