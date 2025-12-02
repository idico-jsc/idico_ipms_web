import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isNative } from './capacitor';

/**
 * Google Authentication Utilities
 *
 * Handles both web and native Google authentication
 * - Web: Uses @react-oauth/google (handled in GoogleButton component)
 * - Native: Uses @codetrix-studio/capacitor-google-auth
 */

/**
 * Initialize Google Auth for native platforms
 * Must be called on app startup for native platforms
 *
 * Note: The plugin will automatically use configuration from capacitor.config.ts
 * We only need to call initialize() to trigger the setup
 */
export const initializeGoogleAuth = async (): Promise<void> => {
  if (!isNative()) return;

  try {
    // Initialize the plugin with grantOfflineAccess to enable refresh tokens
    // The plugin will automatically use serverClientId from capacitor.config.json
    // and server_client_id from Android strings.xml
    await GoogleAuth.initialize({
      grantOfflineAccess: true,
    });
    console.log('Google Auth initialized for native platform');
  } catch (error) {
    console.error('Failed to initialize Google Auth:', error);
    // Don't throw - app should continue even if Google Auth fails to initialize
  }
};

/**
 * Sign in with Google on native platforms
 * Returns the ID token (JWT) that can be sent to backend
 */
export const signInWithGoogleNative = async (): Promise<string> => {
  if (!isNative()) {
    throw new Error('signInWithGoogleNative can only be called on native platforms');
  }

  try {
    console.log('[GoogleAuth] Starting sign in...');

    // Sign in with Google
    const response = await GoogleAuth.signIn();

    console.log('[GoogleAuth] Sign in response:', JSON.stringify(response, null, 2));

    // The authentication property contains the ID token
    if (!response.authentication?.idToken) {
      console.error('[GoogleAuth] No ID token in response. Full response:', response);
      const errorMessage = `No ID token received. Response: ${JSON.stringify(response)}`;
      throw new Error(errorMessage);
    }

    console.log('[GoogleAuth] Sign in successful, ID token received');
    return response.authentication.idToken;
  } catch (error: any) {
    console.error('[GoogleAuth] Sign in error:', error);
    console.error('[GoogleAuth] Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));

    // Create detailed error message for display
    let errorMessage = 'Google Sign-In failed';

    if (error?.message) {
      errorMessage += `: ${error.message}`;
    }

    if (error?.code) {
      errorMessage += ` (Error code: ${error.code})`;
    }

    // Add error type if available
    if (error?.type) {
      errorMessage += ` [${error.type}]`;
    }

    // Throw error with detailed message
    const detailedError = new Error(errorMessage);
    (detailedError as any).originalError = error;
    throw detailedError;
  }
};

/**
 * Sign out from Google on native platforms
 */
export const signOutGoogleNative = async (): Promise<void> => {
  if (!isNative()) return;

  try {
    await GoogleAuth.signOut();
    console.log('Signed out from Google');
  } catch (error) {
    console.error('Google sign out error:', error);
    // Don't throw - sign out should be best effort
  }
};

/**
 * Refresh Google Auth token on native platforms
 */
export const refreshGoogleToken = async (): Promise<string | null> => {
  if (!isNative()) return null;

  try {
    const response = await GoogleAuth.refresh();
    return response.accessToken || null;
  } catch (error) {
    console.error('Failed to refresh Google token:', error);
    return null;
  }
};
