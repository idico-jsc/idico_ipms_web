import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/use-auth";
import { FullPageLoader } from "@/components/molecules";

interface AuthRouteProps {
  children: ReactNode;
}

/**
 * Auth Route Component
 *
 * Wraps authentication routes (login, register, forgot-password).
 * Only accessible when user is NOT logged in.
 * Redirects to home if already authenticated.
 * Shows full-page loader during authentication check.
 */
export function AuthRoute({ children }: AuthRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Show full-page loader while checking auth state
  // if (!isAuthenticated && isLoading) {
  //   return <FullPageLoader message="Loading..." />;
  // }

  if (isAuthenticated) {
    // User is already logged in, redirect to the page they came from or home
    const from = (location.state as any)?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
