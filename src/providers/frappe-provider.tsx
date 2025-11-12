import { FrappeProvider as FrappeSDKProvider } from 'frappe-react-sdk';
import { ReactNode } from 'react';
import { FRAPPE_ENV } from '@/constants/frappe';
import { getToken } from '@/features/auth/services/token-storage';

interface FrappeProviderProps {
  children: ReactNode;
}

/**
 * Frappe Provider
 *
 * Wraps the application with FrappeProvider configured for bearer token authentication.
 * Automatically retrieves token from storage and passes it to Frappe SDK.
 */
export function FrappeProvider({ children }: FrappeProviderProps) {
  // Get Frappe URL from environment variables
  const frappeUrl = FRAPPE_ENV.URL;
  const useToken = FRAPPE_ENV.USE_TOKEN;

  // If no Frappe URL configured, render children without provider
  if (!frappeUrl) {
    console.warn('VITE_FRAPPE_URL not configured. Frappe features will not be available.');
    return <>{children}</>;
  }

  // Configure token parameters if token-based auth is enabled
  const tokenParams = useToken
    ? {
        useToken: true,
        token: () => getToken() || '',
        type: 'Bearer' as const,
      }
    : undefined;

  return (
    <FrappeSDKProvider
      url={frappeUrl}
      tokenParams={tokenParams}
      enableSocket={false} // Disable socket for now, can be enabled later
    >
      {children}
    </FrappeSDKProvider>
  );
}
