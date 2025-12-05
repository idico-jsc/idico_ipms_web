import { getToken, onMessage, deleteToken } from 'firebase/messaging';
import { initializeMessaging } from '@/config/firebase';
import { isWeb } from '@/utils/capacitor';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_PUBLIC_KEY;

/**
 * Firebase Cloud Messaging Service (Web Only)
 */
export class FirebaseMessagingService {
  private static messaging: Awaited<ReturnType<typeof initializeMessaging>> | null = null;

  /**
   * Initialize Firebase Messaging
   */
  static async initialize() {
    if (!isWeb()) return null;

    try {
      if (!this.messaging) {
        this.messaging = await initializeMessaging();
      }
      return this.messaging;
    } catch (error) {
      console.error('Failed to initialize Firebase Messaging:', error);
      return null;
    }
  }

  /**
   * Request notification permission and get FCM token
   */
  static async getToken(): Promise<string | null> {
    const messaging = await this.initialize();
    if (!messaging) return null;

    try {
      // Register service worker first
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      console.log('Service Worker registered:', registration);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      console.log('FCM Token obtained:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  /**
   * Listen to foreground messages
   */
  static onForegroundMessage(callback: (payload: any) => void) {
    if (!this.messaging) {
      console.warn('Messaging not initialized');
      return () => {};
    }

    const unsubscribe = onMessage(this.messaging, (payload) => {
      console.log('Foreground message received:', payload);
      callback(payload);
    });

    return unsubscribe;
  }

  /**
   * Delete FCM token
   */
  static async deleteToken(): Promise<boolean> {
    if (!this.messaging) return false;

    try {
      await deleteToken(this.messaging);
      console.log('FCM token deleted');
      return true;
    } catch (error) {
      console.error('Error deleting FCM token:', error);
      return false;
    }
  }

  /**
   * Check if notifications are supported
   */
  static isSupported(): boolean {
    return isWeb() && 'Notification' in window && 'serviceWorker' in navigator;
  }

  /**
   * Get current permission state
   */
  static getPermissionState(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Request notification permission
   */
  static async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }
}
