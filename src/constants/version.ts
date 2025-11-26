// This file is auto-generated during build
// Access the app version at runtime

import { APP_VERSION as VERSION } from './env';

export const APP_VERSION = VERSION;

/**
 * Get the current application version
 * @returns {string} The current version from package.json
 */
export function getAppVersion(): string {
  return APP_VERSION;
}
