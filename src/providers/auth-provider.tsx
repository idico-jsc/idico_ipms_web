import { PropsWithChildren, type FC } from "react";
import { useAuthInitializer } from "@/features/auth/hooks/use-auth-initializer";

export type AuthProviderProps = PropsWithChildren & {};

/**
 * Auth Provider
 *
 * Initializes authentication on app mount by checking for existing token
 * and fetching user profile using the useAuthInitializer hook.
 */
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // Use the dedicated auth initializer hook
  useAuthInitializer();

  return <>{children}</>;
};
