import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isNative } from './capacitor';
import { GOOGLE_SERVER_CLIENT_ID } from '@/constants/env';

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
 */
export const initializeGoogleAuth = async (): Promise<void> => {
  if (!isNative()) return;

  try {
    // Initialize the plugin with server client ID from environment
    await GoogleAuth.initialize({
      clientId: GOOGLE_SERVER_CLIENT_ID,
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
    console.log('Google Auth initialized for native platform');
  } catch (error) {
    console.error('Failed to initialize Google Auth:', error);
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
    // Sign in with Google
    const response = await GoogleAuth.signIn();

    console.log('Google Auth response:', response);

    // The authentication property contains the ID token
    if (!response.authentication?.idToken) {
      throw new Error('No ID token received from Google');
    }

    return response.authentication.idToken;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
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
