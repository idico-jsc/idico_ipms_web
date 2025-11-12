import { Capacitor } from '@capacitor/core';
import Cookies from 'js-cookie';

/**
 * Token Storage Utilities
 *
 * Provides platform-aware token storage for bearer token authentication.
 * Priority: HttpOnly cookies (server-set) > Client-side cookies > localStorage
 *
 * Strategy:
 * - Read: Try cookies first, fallback to localStorage
 * - Write: Write to both cookies (client-side) and localStorage
 * - Native apps (Capacitor): Use localStorage only (cookies don't work well in WebViews)
 *
 * Note: For maximum security, the server should set HttpOnly cookies on login.
 * This utility provides client-side cookie management as a fallback/supplement.
 */

const TOKEN_KEY = 'frappe_bearer_token';
const TOKEN_EXPIRY_KEY = 'frappe_token_expiry';
const TOKEN_COOKIE_NAME = 'auth_token'; // Name for client-side cookie (server may use different name for HttpOnly cookie)

/**
 * Check if running in native environment
 */
const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Validate and sanitize token to ensure it's safe for HTTP headers
 * @param token - Token to validate
 * @returns Sanitized token or null if invalid
 */
const validateToken = (token: string | null | undefined): string | null => {
  if (!token) return null;

  // Trim whitespace and newlines
  const sanitized = token.trim();

  // Token should not be empty after trimming
  if (!sanitized) return null;

  // Check if token contains only valid ISO-8859-1 characters (safe for HTTP headers)
  // Reject tokens with non-printable characters or invalid bytes
  if (!/^[\x20-\x7E\xA0-\xFF]+$/.test(sanitized)) {
    console.error('Token contains invalid characters for HTTP headers');
    return null;
  }

  return sanitized;
};

/**
 * Get the bearer token from storage
 * Priority: Cookies (including HttpOnly from server) > localStorage
 * @returns The stored token or null if not found/expired
 */
export const getToken = (): string | null => {
  try {
    // For native apps, use localStorage only (cookies don't work reliably in WebViews)
    if (isNative()) {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

      // Check if token is expired
      if (expiry && new Date().getTime() > parseInt(expiry)) {
        removeToken();
        return null;
      }

      return validateToken(token);
    }

    // For web: Try cookies first (includes server-set HttpOnly cookies and client-set cookies)
    // Note: We can't read HttpOnly cookies with JavaScript, but they're automatically sent with requests
    // So we check for client-side cookie first, then fallback to localStorage
    let token = Cookies.get(TOKEN_COOKIE_NAME);

    // Fallback to localStorage if no cookie found
    if (!token) {
      token = localStorage.getItem(TOKEN_KEY) || undefined;
    }

    if (!token) {
      return null;
    }

    // Check expiry from localStorage or cookie
    const expiryFromStorage = localStorage.getItem(TOKEN_EXPIRY_KEY);
    const expiryFromCookie = Cookies.get(`${TOKEN_COOKIE_NAME}_expiry`);
    const expiry = expiryFromCookie || expiryFromStorage;

    // Check if token is expired
    if (expiry && new Date().getTime() > parseInt(expiry)) {
      removeToken();
      return null;
    }

    return validateToken(token);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Store the bearer token
 * Writes to both cookies (client-side) and localStorage for maximum compatibility
 * @param token - The bearer token to store
 * @param expiresIn - Token expiration time in seconds (optional)
 */
export const setToken = (token: string, expiresIn?: number): void => {
  try {
    // Validate token before storing
    const validatedToken = validateToken(token);
    if (!validatedToken) {
      console.error('Cannot store invalid token');
      throw new Error('Invalid token format - contains non-ISO-8859-1 characters');
    }

    if (isNative()) {
      // For native apps, use localStorage only
      localStorage.setItem(TOKEN_KEY, validatedToken);

      // Set expiry if provided
      if (expiresIn) {
        const expiryTime = new Date().getTime() + expiresIn * 1000;
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
      }
    } else {
      // For web: Write to BOTH cookies and localStorage
      // localStorage provides fallback if cookies are disabled
      localStorage.setItem(TOKEN_KEY, validatedToken);

      // Set cookie with appropriate options
      const cookieOptions: Cookies.CookieAttributes = {
        sameSite: 'Strict', // CSRF protection
        secure: window.location.protocol === 'https:', // Only send over HTTPS in production
      };

      // If expiry is provided, set it for both cookie and localStorage
      if (expiresIn) {
        const expiryTime = new Date().getTime() + expiresIn * 1000;
        const expiryDate = new Date(expiryTime);

        // Set cookie with expiry
        cookieOptions.expires = expiryDate;
        Cookies.set(TOKEN_COOKIE_NAME, validatedToken, cookieOptions);

        // Store expiry timestamp
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
        Cookies.set(`${TOKEN_COOKIE_NAME}_expiry`, expiryTime.toString(), cookieOptions);
      } else {
        // Session cookie (expires when browser closes)
        Cookies.set(TOKEN_COOKIE_NAME, validatedToken, cookieOptions);
      }
    }
  } catch (error) {
    console.error('Error setting token:', error);
    throw error; // Re-throw to let caller handle the error
  }
};

/**
 * Remove the bearer token from storage
 * Clears both cookies and localStorage
 */
export const removeToken = (): void => {
  try {
    // Remove from localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);

    // Remove from cookies (web only, but safe to call on native)
    if (!isNative()) {
      Cookies.remove(TOKEN_COOKIE_NAME);
      Cookies.remove(`${TOKEN_COOKIE_NAME}_expiry`);
      Cookies.remove('sid')
      Cookies.remove('system_user')
      Cookies.remove('user_id')
      Cookies.remove('user_image')
    }
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

/**
 * Check if a valid token exists
 * @returns True if a valid token exists
 */
export const hasToken = (): boolean => {
  return getToken() !== null;
};

/**
 * Get token expiry time
 * @returns Expiry timestamp or null
 */
export const getTokenExpiry = (): number | null => {
  try {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    return expiry ? parseInt(expiry) : null;
  } catch (error) {
    console.error('Error getting token expiry:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @returns True if token is expired or doesn't exist
 */
export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiry();
  if (!expiry) return false;

  return new Date().getTime() > expiry;
};

/**
 * Get time until token expires (in seconds)
 * @returns Seconds until expiration, or null if no expiry set
 */
export const getTimeUntilExpiry = (): number | null => {
  const expiry = getTokenExpiry();
  if (!expiry) return null;

  const now = new Date().getTime();
  const timeRemaining = expiry - now;

  return timeRemaining > 0 ? Math.floor(timeRemaining / 1000) : 0;
};
