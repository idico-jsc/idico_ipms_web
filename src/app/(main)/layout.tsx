import { ReactNode } from "react";
import { ProtectedRoute } from "@features";
import { FullPageLoader } from "@/components/molecules";
import { SidebarLayout } from "@/components/templates";
import { useAuthStore } from "@/features/auth/store/auth-store";

interface RootLayoutProps {
  children: ReactNode;
}

/**
 * Main Layout for authenticated routes
 *
 * Shows full-page loader during initial auth verification
 * Only redirects to login if token is actually invalid (401/403)
 */
export default function RootLayout({ children }: RootLayoutProps) {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoading = useAuthStore((state) => state.isLoading);

  return (
    <ProtectedRoute>
      {/* Show full-page loader during initial auth check */}
      {!isInitialized || isLoading ? (
        <FullPageLoader message="Loading..." />
      ) : (
        <SidebarLayout>{children}</SidebarLayout>
      )}
    </ProtectedRoute>
  );
}
