import { useEffect, useState } from 'react';
import {
  isNative,
  isIOS,
  isAndroid,
  isWeb,
  getPlatform,
  addAppStateChangeListener,
  addUrlOpenListener,
  addBackButtonListener,
  getAppInfo,
} from '@/utils/capacitor';

/**
 * Hook for detecting the current platform
 */
export const usePlatform = () => {
  const platform = getPlatform();

  return {
    platform,
    isNative: isNative(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isWeb: isWeb(),
  };
};

/**
 * Hook for listening to app state changes
 */
export const useAppState = (callback: (isActive: boolean) => void) => {
  useEffect(() => {
    if (!isNative()) return;

    const removeListener = addAppStateChangeListener((state) => {
      callback(state.isActive);
    });

    return () => {
      removeListener();
    };
  }, [callback]);
};

/**
 * Hook for tracking app active state
 */
export const useAppActiveState = () => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isNative()) return;

    const removeListener = addAppStateChangeListener((state) => {
      setIsActive(state.isActive);
    });

    return () => {
      removeListener();
    };
  }, []);

  return isActive;
};

/**
 * Hook for listening to URL open events (deep links)
 */
export const useUrlOpen = (callback: (url: string) => void) => {
  useEffect(() => {
    if (!isNative()) return;

    const removeListener = addUrlOpenListener((data) => {
      callback(data.url);
    });

    return () => {
      removeListener();
    };
  }, [callback]);
};

/**
 * Hook for listening to back button press (Android only)
 */
export const useBackButton = (callback: () => void) => {
  useEffect(() => {
    if (!isAndroid()) return;

    const removeListener = addBackButtonListener(callback);

    return () => {
      removeListener();
    };
  }, [callback]);
};

/**
 * Hook for getting app information
 */
export const useAppInfo = () => {
  const [appInfo, setAppInfo] = useState<{
    name: string;
    id: string;
    version: string;
    build: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAppInfo = async () => {
      try {
        setLoading(true);
        const info = await getAppInfo();
        setAppInfo(info);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get app info'));
      } finally {
        setLoading(false);
      }
    };

    fetchAppInfo();
  }, []);

  return { appInfo, loading, error };
};

/**
 * Combined hook for Capacitor functionality
 */
export const useCapacitor = () => {
  const platformInfo = usePlatform();
  const isActive = useAppActiveState();
  const { appInfo, loading: appInfoLoading } = useAppInfo();

  return {
    ...platformInfo,
    isActive,
    appInfo,
    appInfoLoading,
  };
};
