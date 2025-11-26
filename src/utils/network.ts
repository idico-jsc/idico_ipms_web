/**
 * Network utilities for detecting online/offline status
 * Works across web and mobile (Capacitor) platforms
 */

export type NetworkStatus = {
  isOnline: boolean;
};

/**
 * Get current network status
 */
export const getNetworkStatus = (): NetworkStatus => {
  return {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  };
};

/**
 * Add listener for network status changes
 */
export const addNetworkChangeListener = (
  callback: (status: NetworkStatus) => void
): (() => void) => {
  const handleOnline = () => callback({ isOnline: true });
  const handleOffline = () => callback({ isOnline: false });

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};
