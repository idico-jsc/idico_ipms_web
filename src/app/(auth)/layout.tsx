import { ReactNode } from 'react';
import { AuthRoute } from '@/features/auth/components/auth-route';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Auth Layout
 *
 * Layout for authentication pages (login, register, forgot-password).
 * Wraps all auth routes with AuthRoute component to redirect if already logged in.
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthRoute>
      {children}
    </AuthRoute>
  );
}
