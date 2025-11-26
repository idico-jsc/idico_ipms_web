import { ReactNode } from "react";
import { Toaster } from "sonner";
import { useTheme } from "@/hooks";
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

export function Providers({ children }: ProvidersProps) {
  const { theme } = useTheme();
  return (
    <I18nProvider>
      <NetworkProvider>
        <GoogleOAuthProvider>
          <PushNotificationProvider>
            <SWRProvider>
              <FrappeProvider>
                <AuthProvider>
                  {children}
                  <Toaster richColors={true} theme={theme} />
                </AuthProvider>
              </FrappeProvider>
            </SWRProvider>
          </PushNotificationProvider>
        </GoogleOAuthProvider>
      </NetworkProvider>
    </I18nProvider>
  );
}
