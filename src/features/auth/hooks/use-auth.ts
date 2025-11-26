import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/auth-store";
import { FrappeError } from "@/types";
import { toast } from "sonner";
import { useError } from "@/hooks";
import { resetPassword } from "../services/api";

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
  const loginWithGoogleAction = useAuthStore((state) => state.loginWithGoogle);
  const logoutAction = useAuthStore((state) => state.logout);

  const [isResettingPassword, setIsResettingPassword] = useState(false);

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
          testId: "invalid_credentials",
          description: t("error.invalid_credentials.message"),
        });
        return;
      }
      if (frappeError?.exc_type === "SecurityException") {
        toast.error(t("error.login_locked.title"), {
          testId: "login_locked",
          description: t("error.login_locked.message"),
        });
        return;
      }
      handleError(frappeError);
    }
  };

  // Google login wrapper
  const loginWithGoogle = async (idToken: string) => {
    try {
      await loginWithGoogleAction(idToken);
    } catch (error) {
      // Type guard for FrappeError
      const frappeError = error as FrappeError;

      // Handle Google-specific errors with fallback message
      toast.error("Google Login Failed", {
        testId: "google_login_failed",
        description: "Failed to authenticate with Google. Please try again.",
      });
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

  // Reset password wrapper
  const reset = async (token: string, newPassword: string) => {
    try {
      setIsResettingPassword(true);
      await resetPassword(token, newPassword);
      return Promise.resolve();
    } catch (error) {
      // Type guard for FrappeError
      const frappeError = error as FrappeError;

      // Rethrow with translated message
      if (frappeError?.message === "The reset password link has been expired") {
        toast.error(t("error.reset_password_token_expired.title"), {
          testId: "reset_password_token_expired",
          description: t("error.reset_password_token_expired.message"),
        });
      } else {
        handleError(frappeError);
      }
      return Promise.reject(frappeError);
    } finally {
      setIsResettingPassword(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    loginWithGoogle,
    logout,
    reset,
    isAuthenticated,
    isResettingPassword,
  };
}
