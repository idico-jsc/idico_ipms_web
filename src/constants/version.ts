// This file is auto-generated during build
// Access the app version at runtime

export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '0.0.0';

/**
 * Get the current application version
 * @returns {string} The current version from package.json
 */
export function getAppVersion(): string {
  return APP_VERSION;
}
