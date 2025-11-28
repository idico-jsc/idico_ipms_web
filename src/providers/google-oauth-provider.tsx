import { GoogleOAuthProvider as GoogleProvider } from "@react-oauth/google";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { GOOGLE_CLIENT_ID } from "@/constants/env";
import { initializeGoogleAuth, isNative } from "@/utils";

interface GoogleOAuthProviderProps {
  children: ReactNode;
}

export function GoogleOAuthProvider({ children }: GoogleOAuthProviderProps) {
  const clientId = GOOGLE_CLIENT_ID;

  // Initialize Google Auth for native platforms
  useEffect(() => {
    if (isNative()) {
      initializeGoogleAuth();
    }
  }, []);

  // For native platforms, we don't need the web GoogleProvider wrapper
  if (isNative()) {
    return <>{children}</>;
  }

  // If no client ID, still wrap with provider using a dummy ID to prevent context errors
  // The login button will be disabled in the UI when client ID is missing
  if (!clientId) {
    console.warn(
      "Google OAuth Client ID not configured. Google login will be disabled.",
    );
    // Use a dummy client ID to prevent context errors
    // The actual login will fail gracefully if attempted
    return (
      <GoogleProvider clientId="GOOGLE_CLIENT_ID_NOT_CONFIGURED">
        {children}
      </GoogleProvider>
    );
  }

  return <GoogleProvider clientId={clientId}>{children}</GoogleProvider>;
}
