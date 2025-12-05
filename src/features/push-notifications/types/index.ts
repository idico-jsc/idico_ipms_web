/**
 * Push Notification Types
 */

export interface NotificationPermissionState {
  permission: NotificationPermission;
  supported: boolean;
  denied: boolean;
  granted: boolean;
}

export interface FCMToken {
  token: string;
  platform: 'web' | 'android' | 'ios';
  createdAt: string;
}

export interface PushNotificationPayload {
  notification?: {
    title: string;
    body: string;
    icon?: string;
    image?: string;
  };
  data?: Record<string, string>;
}

export interface NotificationSubscription {
  fcmToken: string | null;
  capacitorToken: string | null;
  isSubscribed: boolean;
  error: string | null;
}
