import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { hasToken } from '@/features/auth/services/token-storage';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected Route Component
 *
 * Wraps routes that require authentication.
 * Only checks if token exists - doesn't wait for verification.
 * Redirects to /login if no token found.
 *
 * Flow:
 * 1. If no token → redirect to login immediately
 * 2. If has token → allow access, let Main Layout handle verification loading
 * 3. If token invalid (401/403) → API client calls handleUnauthorized() → redirect
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  // Quick check: if no token at all, redirect immediately
  if (!hasToken()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Has token - let them in, Main Layout will show loading during verification
  return <>{children}</>;
}
