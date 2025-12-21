import { useEffect, useState } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type OperatingSystem = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'other';

export interface DeviceInfo {
  /** Current device type based on screen width */
  deviceType: DeviceType;
  /** Current operating system */
  os: OperatingSystem;
  /** Current window width in pixels */
  width: number;
  /** Current window height in pixels */
  height: number;
  /** Whether the device is in portrait orientation */
  isPortrait: boolean;
  /** Whether the device is in landscape orientation */
  isLandscape: boolean;
  /** Whether the device is mobile (width < 768px) */
  isMobile: boolean;
  /** Whether the device is tablet (768px <= width < 1024px) */
  isTablet: boolean;
  /** Whether the device is desktop (width >= 1024px) */
  isDesktop: boolean;
  /** Whether the device is touch-enabled */
  isTouch: boolean;
  /** Whether the OS is iOS */
  isIOS: boolean;
  /** Whether the OS is Android */
  isAndroid: boolean;
  /** Whether the OS is Windows */
  isWindows: boolean;
  /** Whether the OS is macOS */
  isMacOS: boolean;
}

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

/**
 * Detect the operating system from user agent
 */
function detectOS(): OperatingSystem {
  const userAgent = window.navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }
  if (/android/.test(userAgent)) {
    return 'android';
  }
  if (/windows/.test(userAgent)) {
    return 'windows';
  }
  if (/macintosh|mac os x/.test(userAgent)) {
    return 'macos';
  }
  if (/linux/.test(userAgent)) {
    return 'linux';
  }
  return 'other';
}

/**
 * Detect device type based on screen width
 */
function detectDeviceType(width: number): DeviceType {
  if (width < MOBILE_BREAKPOINT) {
    return 'mobile';
  }
  if (width < TABLET_BREAKPOINT) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Check if device supports touch
 */
function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - msMaxTouchPoints is not in the type definition
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Hook to detect device information
 *
 * @example
 * ```tsx
 * const device = useDetectDevice();
 *
 * if (device.isMobile) {
 *   return <MobileView />;
 * }
 *
 * if (device.isIOS) {
 *   return <IOSSpecificFeature />;
 * }
 * ```
 */
export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const os = detectOS();
    const deviceType = detectDeviceType(width);
    const isTouch = isTouchDevice();

    return {
      deviceType,
      os,
      width,
      height,
      isPortrait: height > width,
      isLandscape: width > height,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'desktop',
      isTouch,
      isIOS: os === 'ios',
      isAndroid: os === 'android',
      isWindows: os === 'windows',
      isMacOS: os === 'macos',
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const deviceType = detectDeviceType(width);

      setDeviceInfo((prev) => ({
        ...prev,
        width,
        height,
        deviceType,
        isPortrait: height > width,
        isLandscape: width > height,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceInfo;
}
