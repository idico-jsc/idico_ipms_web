import { isNative, getPlatform } from '@/utils/capacitor';
import { FirebaseMessagingService } from './firebase-messaging.service';
import { CapacitorPushService } from './capacitor-push.service';
import { PUSH_NOTIFICATION_ENDPOINTS, NOTIFICATION_STORAGE_KEY } from '../constants';

/**
 * Unified Push Notification Service
 * Handles both web (FCM) and native (Capacitor) push notifications
 */
export class PushNotificationService {
  /**
   * Initialize push notifications for current platform
   */
  static async initialize() {
    if (isNative()) {
      return await CapacitorPushService.initialize();
    } else {
      const messaging = await FirebaseMessagingService.initialize();
      return !!messaging;
    }
  }

  /**
   * Request permission and get token
   */
  static async requestPermissionAndGetToken(): Promise<string | null> {
    // Request permission first
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    // Get token based on platform
    if (isNative()) {
      return await CapacitorPushService.getToken();
    } else {
      return await FirebaseMessagingService.getToken();
    }
  }

  /**
   * Request notification permission
   */
  static async requestPermission(): Promise<NotificationPermission> {
    if (isNative()) {
      const initialized = await CapacitorPushService.initialize();
      return initialized ? 'granted' : 'denied';
    } else {
      return await FirebaseMessagingService.requestPermission();
    }
  }

  /**
   * Get current permission state
   */
  static getPermissionState(): NotificationPermission {
    if (isNative()) {
      // For native, we can't check permission without requesting
      return 'default';
    }
    return FirebaseMessagingService.getPermissionState();
  }

  /**
   * Register token with backend
   */
  static async registerToken(token: string): Promise<void> {
    const platform = getPlatform();

    try {
      // TODO: Replace with your actual API client method from @/utils
      const response = await fetch(PUSH_NOTIFICATION_ENDPOINTS.REGISTER_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          platform,
          device_info: {
            userAgent: navigator.userAgent,
            platform: platform,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register token with backend');
      }

      console.log('Token registered with backend:', token);

      // Store token locally
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, token);
      localStorage.setItem(`${NOTIFICATION_STORAGE_KEY}-platform`, platform);
    } catch (error) {
      console.error('Failed to register token with backend:', error);
      throw error;
    }
  }

  /**
   * Unregister token from backend
   */
  static async unregisterToken(token: string): Promise<void> {
    try {
      // TODO: Replace with your actual API client method from @/utils
      const response = await fetch(PUSH_NOTIFICATION_ENDPOINTS.UNREGISTER_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to unregister token from backend');
      }

      console.log('Token unregistered from backend');

      // Clear local storage
      localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
      localStorage.removeItem(`${NOTIFICATION_STORAGE_KEY}-platform`);
    } catch (error) {
      console.error('Failed to unregister token from backend:', error);
      throw error;
    }
  }

  /**
   * Delete token
   */
  static async deleteToken(): Promise<boolean> {
    if (isNative()) {
      await CapacitorPushService.removeAllListeners();
      return true;
    } else {
      return await FirebaseMessagingService.deleteToken();
    }
  }

  /**
   * Send test notification (for testing purposes)
   */
  static async sendTestNotification(): Promise<void> {
    try {
      // TODO: Replace with your actual API client method from @/utils
      const response = await fetch(PUSH_NOTIFICATION_ENDPOINTS.SEND_TEST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      console.log('Test notification sent');
    } catch (error) {
      console.error('Failed to send test notification:', error);
      throw error;
    }
  }
}
