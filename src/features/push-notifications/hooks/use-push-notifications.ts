import { useState, useEffect, useCallback } from 'react';
import { PushNotificationService } from '../services/push-notification.service';
import { FirebaseMessagingService } from '../services/firebase-messaging.service';
import { CapacitorPushService } from '../services/capacitor-push.service';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { isNative } from '@/utils/capacitor';
import { NOTIFICATION_STORAGE_KEY } from '../constants';

/**
 * Push Notifications Hook
 * Manages push notification subscription, permissions, and messaging
 */
export function usePushNotifications() {
  const { isAuthenticated } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  /**
   * Initialize push notifications
   */
  const initialize = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      await PushNotificationService.initialize();

      // Check current permission
      const currentPermission = PushNotificationService.getPermissionState();
      setPermission(currentPermission);

      // If already granted, check for stored token
      if (currentPermission === 'granted') {
        const storedToken = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
        if (storedToken) {
          setToken(storedToken);
          setIsSubscribed(true);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize push notifications';
      setError(errorMessage);
      console.error('Push notification initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Request permission and subscribe
   */
  const subscribe = useCallback(async () => {
    if (!isAuthenticated) {
      setError('User must be authenticated to subscribe to notifications');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request permission and get token
      const fcmToken = await PushNotificationService.requestPermissionAndGetToken();

      if (!fcmToken) {
        throw new Error('Failed to get notification token');
      }

      // Register with backend
      await PushNotificationService.registerToken(fcmToken);

      setToken(fcmToken);
      setPermission('granted');
      setIsSubscribed(true);

      console.log('Successfully subscribed to push notifications');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe to notifications';
      setError(errorMessage);
      console.error('Subscription error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribe = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      // Unregister from backend
      await PushNotificationService.unregisterToken(token);

      // Delete token
      await PushNotificationService.deleteToken();

      setToken(null);
      setIsSubscribed(false);

      console.log('Successfully unsubscribed from push notifications');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe from notifications';
      setError(errorMessage);
      console.error('Unsubscription error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  /**
   * Send test notification
   */
  const sendTestNotification = useCallback(async () => {
    if (!isSubscribed) {
      setError('Not subscribed to notifications');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await PushNotificationService.sendTestNotification();
      console.log('Test notification sent');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send test notification';
      setError(errorMessage);
      console.error('Test notification error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isSubscribed]);

  /**
   * Listen to foreground messages (web only)
   */
  useEffect(() => {
    if (!isAuthenticated || !isSubscribed || isNative()) return;

    const unsubscribeFn = FirebaseMessagingService.onForegroundMessage((payload) => {
      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log('║         FIREBASE FOREGROUND MESSAGE RECEIVED               ║');
      console.log('╚════════════════════════════════════════════════════════════╝');

      // Log complete payload structure
      console.log('\n📦 FULL PAYLOAD:');
      console.log(JSON.stringify(payload, null, 2));

      // Log payload structure details
      console.log('\n🔍 PAYLOAD STRUCTURE:');
      console.log('├─ Has "notification" object:', !!payload.notification);
      console.log('├─ Has "data" object:', !!payload.data);
      console.log('├─ Has "fcmOptions" object:', !!(payload as any).fcmOptions);
      console.log('└─ Has "from" field:', !!(payload as any).from);

      // Log notification object if exists
      if (payload.notification) {
        console.log('\n📬 NOTIFICATION OBJECT:');
        console.log('├─ title:', payload.notification.title);
        console.log('├─ body:', payload.notification.body);
        console.log('├─ icon:', payload.notification.icon);
        console.log('└─ image:', (payload.notification as any).image);
      }

      // Log data object if exists
      if (payload.data) {
        console.log('\n📋 DATA OBJECT:');
        Object.entries(payload.data).forEach(([key, value], index, arr) => {
          const prefix = index === arr.length - 1 ? '└─' : '├─';
          console.log(`${prefix} ${key}:`, value);
        });
      }

      // Handle both notification and data-only messages
      let notificationTitle = 'New Message';
      let notificationBody = '';
      let notificationIcon = '/pwa-192x192.svg';

      if (payload.notification) {
        // Standard notification message
        console.log('\n✅ MESSAGE TYPE: NOTIFICATION MESSAGE (has notification object)');
        notificationTitle = payload.notification.title || notificationTitle;
        notificationBody = payload.notification.body || '';
        notificationIcon = payload.notification.icon || notificationIcon;
      } else if (payload.data) {
        // Data-only message - extract from data
        console.log('\n⚠️ MESSAGE TYPE: DATA-ONLY MESSAGE (no notification object)');
        notificationTitle = payload.data.title || payload.data.notification_title || notificationTitle;
        notificationBody = payload.data.body || payload.data.message || '';
        notificationIcon = payload.data.icon || notificationIcon;
      }

      console.log('\n🎯 FINAL NOTIFICATION VALUES:');
      console.log('├─ Title:', notificationTitle);
      console.log('├─ Body:', notificationBody);
      console.log('└─ Icon:', notificationIcon);
      console.log('\n' + '═'.repeat(60) + '\n');

      // COMMENTED OUT: Show browser notification for debugging
      // Uncomment this block when ready to display notifications
      /*
      if (Notification.permission === 'granted') {
        new Notification(notificationTitle, {
          body: notificationBody,
          icon: notificationIcon,
          data: payload.data,
        });
      }
      */
    });

    return () => {
      unsubscribeFn();
    };
  }, [isAuthenticated, isSubscribed]);

  /**
   * Listen to native notifications (mobile only)
   */
  useEffect(() => {
    if (!isAuthenticated || !isSubscribed || !isNative()) return;

    const cleanup = CapacitorPushService.addListeners({
      onNotificationReceived: (notification) => {
        console.log('Native notification received:', notification);
      },
      onNotificationClicked: (notification) => {
        console.log('Native notification clicked:', notification);
        // Handle navigation based on notification.data
      },
    });

    return cleanup;
  }, [isAuthenticated, isSubscribed]);

  /**
   * Auto-initialize on mount if authenticated
   */
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    token,
    permission,
    isLoading,
    error,
    isSubscribed,
    subscribe,
    unsubscribe,
    sendTestNotification,
    isSupported: FirebaseMessagingService.isSupported() || isNative(),
  };
}
