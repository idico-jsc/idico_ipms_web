import { ResetPasswordPage } from "@/components/pages";
import { ROUTES } from "@/constants/routes";
import { useParams, Navigate } from "react-router";

/**
 * Reset Password Page
 *
 * Allows users to reset their password using a token from email.
 * Token is passed via URL path parameter: /reset-password/:token
 * Redirects to forgot-password page if no token is present.
 *
 * @example
 * URL: /reset-password/abc123xyz
 * The token "abc123xyz" will be extracted and passed to ResetPasswordForm
 */
export default function Page() {
  const { token } = useParams<{ token: string }>();

  // If no token in URL, redirect to forgot password page
  if (!token) {
    return <Navigate to={ROUTES.FORGOT_PASSWORD} replace />;
  }

  return <ResetPasswordPage  />;
}
