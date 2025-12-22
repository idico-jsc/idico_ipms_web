import { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "./theme-provider";
import { I18nProvider } from "./i18n-provider";
import { SWRProvider } from "./swr-provider";
import { FrappeProvider } from "./frappe-provider";
import { AuthProvider } from "./auth-provider";
import { GoogleOAuthProvider } from "./google-oauth-provider";
import { NetworkProvider } from "./network-provider";
import { PushNotificationProvider } from "./push-notification-provider";

interface ProvidersProps {
  children: ReactNode;
}

function ProvidersInner({ children }: ProvidersProps) {
  const { theme } = useTheme();
  return (
    <>
      {children}
      <Toaster richColors={true} theme={theme} />
    </>
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <NetworkProvider>
          <GoogleOAuthProvider>
            <PushNotificationProvider>
              <SWRProvider>
                <FrappeProvider>
                  <AuthProvider>
                    <ProvidersInner>{children}</ProvidersInner>
                  </AuthProvider>
                </FrappeProvider>
              </SWRProvider>
            </PushNotificationProvider>
          </GoogleOAuthProvider>
        </NetworkProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
