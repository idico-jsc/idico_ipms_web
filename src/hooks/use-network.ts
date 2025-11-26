import { useEffect, useState } from 'react';
import {
  addNetworkChangeListener,
  getNetworkStatus,
  type NetworkStatus,
} from '@/utils/network';

/**
 * React hook for monitoring network status
 * @returns Current network status (isOnline)
 */
export const useNetwork = (): NetworkStatus => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(
    getNetworkStatus()
  );

  useEffect(() => {
    // Set initial status
    setNetworkStatus(getNetworkStatus());

    // Listen for changes
    const cleanup = addNetworkChangeListener(setNetworkStatus);

    return cleanup;
  }, []);

  return networkStatus;
};
