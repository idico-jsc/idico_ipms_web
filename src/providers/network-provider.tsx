import { createContext, useContext, type ReactNode } from 'react';
import { useNetwork } from '@/hooks/use-network';
import type { NetworkStatus } from '@/utils/network';

const NetworkContext = createContext<NetworkStatus | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const networkStatus = useNetwork();

  return (
    <NetworkContext.Provider value={networkStatus}>
      {children}
    </NetworkContext.Provider>
  );
};

/**
 * Hook to access network status from context
 * @throws Error if used outside NetworkProvider
 */
export const useNetworkStatus = (): NetworkStatus => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetworkStatus must be used within NetworkProvider');
  }
  return context;
};
