import { PushNotifications } from '@capacitor/push-notifications';
import { isNative } from '@/utils/capacitor';

/**
 * Capacitor Push Notifications Service (Mobile Only)
 */
export class CapacitorPushService {
  /**
   * Initialize Capacitor Push Notifications
   */
  static async initialize(): Promise<boolean> {
    if (!isNative()) return false;

    try {
      // Request permission
      const permission = await PushNotifications.requestPermissions();

      if (permission.receive === 'granted') {
        await PushNotifications.register();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to initialize Capacitor Push:', error);
      return false;
    }
  }

  /**
   * Get FCM token for native platforms
   */
  static async getToken(): Promise<string | null> {
    if (!isNative()) return null;

    return new Promise((resolve) => {
      // Listen for registration
      PushNotifications.addListener('registration', (token) => {
        console.log('Capacitor Push token:', token.value);
        resolve(token.value);
      });

      // Listen for registration errors
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Capacitor Push registration error:', error);
        resolve(null);
      });

      // Trigger registration
      PushNotifications.register();
    });
  }

  /**
   * Listen to push notifications
   */
  static addListeners(callbacks: {
    onNotificationReceived?: (notification: any) => void;
    onNotificationClicked?: (notification: any) => void;
  }) {
    if (!isNative()) return () => {};

    const listeners: any[] = [];

    if (callbacks.onNotificationReceived) {
      PushNotifications.addListener('pushNotificationReceived', callbacks.onNotificationReceived)
        .then(listener => listeners.push(listener));
    }

    if (callbacks.onNotificationClicked) {
      PushNotifications.addListener('pushNotificationActionPerformed', callbacks.onNotificationClicked)
        .then(listener => listeners.push(listener));
    }

    // Return cleanup function
    return () => {
      listeners.forEach(listener => listener.remove());
    };
  }

  /**
   * Remove all listeners
   */
  static async removeAllListeners() {
    if (!isNative()) return;
    await PushNotifications.removeAllListeners();
  }
}
