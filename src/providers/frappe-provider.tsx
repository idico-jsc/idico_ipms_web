import { FrappeProvider as FrappeSDKProvider } from 'frappe-react-sdk';
import { ReactNode } from 'react';
import { FRAPPE_DOMAIN } from '@/constants/env';
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
  const frappeUrl = FRAPPE_DOMAIN;

  // If no Frappe URL configured, render children without provider
  if (!frappeUrl) {
    console.warn('VITE_FRAPPE_DOMAIN not configured. Frappe features will not be available.');
    return <>{children}</>;
  }

  // Configure token parameters for bearer token authentication
  const tokenParams = {
    useToken: true,
    token: () => getToken() || '',
    type: 'Bearer' as const,
  };

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
