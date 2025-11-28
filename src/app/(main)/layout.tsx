import { ReactNode } from "react";
import { Header } from "@/components/organisms/header";
import { ProtectedRoute } from "@features";
import { FullPageLoader } from "@/components/molecules";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { usePlatform } from "@/hooks/use-capacitor";

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
  const { isNative } = usePlatform();

  return (
    <ProtectedRoute>
      {/* Show full-page loader during initial auth check */}
      {!isInitialized || isLoading ? (
        <FullPageLoader message="Loading..." />
      ) : (
        <div className="flex w-full flex-col">
          <Header />
          <div
            className="container mx-auto w-full flex-1"
            style={isNative ? {
              paddingTop: '0.5rem', // Additional spacing after header on mobile
            } : undefined}
          >
            {children}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
