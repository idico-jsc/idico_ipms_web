import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Platform Detection Utilities
 */

/**
 * Check if the app is running in a native environment (iOS or Android)
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Check if the app is running on iOS
 */
export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

/**
 * Check if the app is running on Android
 */
export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

/**
 * Check if the app is running in a web browser
 */
export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};

/**
 * Get the current platform name
 */
export const getPlatform = (): 'ios' | 'android' | 'web' => {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

/**
 * Status Bar Utilities
 */

/**
 * Set the status bar style (light or dark)
 */
export const setStatusBarStyle = async (isDark: boolean): Promise<void> => {
  if (!isNative()) return;

  try {
    await StatusBar.setStyle({
      style: isDark ? Style.Dark : Style.Light,
    });
  } catch (error) {
    console.error('Error setting status bar style:', error);
  }
};

/**
 * Set the status bar background color (Android only)
 */
export const setStatusBarColor = async (color: string): Promise<void> => {
  if (!isAndroid()) return;

  try {
    await StatusBar.setBackgroundColor({ color });
  } catch (error) {
    console.error('Error setting status bar color:', error);
  }
};

/**
 * Show the status bar
 */
export const showStatusBar = async (): Promise<void> => {
  if (!isNative()) return;

  try {
    await StatusBar.show();
  } catch (error) {
    console.error('Error showing status bar:', error);
  }
};

/**
 * Hide the status bar
 */
export const hideStatusBar = async (): Promise<void> => {
  if (!isNative()) return;

  try {
    await StatusBar.hide();
  } catch (error) {
    console.error('Error hiding status bar:', error);
  }
};

/**
 * Splash Screen Utilities
 */

/**
 * Hide the splash screen
 */
export const hideSplashScreen = async (): Promise<void> => {
  if (!isNative()) return;

  try {
    await SplashScreen.hide();
  } catch (error) {
    console.error('Error hiding splash screen:', error);
  }
};

/**
 * Show the splash screen
 */
export const showSplashScreen = async (): Promise<void> => {
  if (!isNative()) return;

  try {
    await SplashScreen.show();
  } catch (error) {
    console.error('Error showing splash screen:', error);
  }
};

/**
 * App Info Utilities
 */

/**
 * Get the app information (name, version, build number, etc.)
 */
export const getAppInfo = async () => {
  if (!isNative()) {
    return {
      name: 'Parent Portal',
      id: 'com.wellspring.parentportal',
      version: import.meta.env.VITE_APP_VERSION || '0.0.0',
      build: '1',
    };
  }

  try {
    const info = await App.getInfo();
    return info;
  } catch (error) {
    console.error('Error getting app info:', error);
    return null;
  }
};

/**
 * App Lifecycle Utilities
 */

/**
 * Add a listener for app state changes (active, background, etc.)
 */
export const addAppStateChangeListener = (
  callback: (state: { isActive: boolean }) => void
) => {
  if (!isNative()) return () => {};

  let removeListener: (() => void) | undefined;

  App.addListener('appStateChange', callback).then((listener) => {
    removeListener = () => listener.remove();
  });

  return () => {
    if (removeListener) removeListener();
  };
};

/**
 * Add a listener for URL open events (deep links)
 */
export const addUrlOpenListener = (callback: (data: { url: string }) => void) => {
  if (!isNative()) return () => {};

  let removeListener: (() => void) | undefined;

  App.addListener('appUrlOpen', callback).then((listener) => {
    removeListener = () => listener.remove();
  });

  return () => {
    if (removeListener) removeListener();
  };
};

/**
 * Add a listener for back button press (Android only)
 */
export const addBackButtonListener = (callback: () => void) => {
  if (!isAndroid()) return () => {};

  let removeListener: (() => void) | undefined;

  App.addListener('backButton', callback).then((listener) => {
    removeListener = () => listener.remove();
  });

  return () => {
    if (removeListener) removeListener();
  };
};

/**
 * Exit the app (Android only)
 */
export const exitApp = (): void => {
  if (!isAndroid()) return;

  App.exitApp();
};

/**
 * Initialization Utilities
 */

/**
 * Initialize the Capacitor app with default settings
 */
export const initializeCapacitor = async (options?: {
  statusBarStyle?: 'dark' | 'light';
  statusBarColor?: string;
  hideSplashScreen?: boolean;
}): Promise<void> => {
  if (!isNative()) return;

  try {
    // Set status bar style
    if (options?.statusBarStyle) {
      await setStatusBarStyle(options.statusBarStyle === 'dark');
    }

    // Set status bar color (Android only)
    if (options?.statusBarColor && isAndroid()) {
      await setStatusBarColor(options.statusBarColor);
    }

    // Hide splash screen if requested
    if (options?.hideSplashScreen !== false) {
      await hideSplashScreen();
    }
  } catch (error) {
    console.error('Error initializing Capacitor:', error);
  }
};
