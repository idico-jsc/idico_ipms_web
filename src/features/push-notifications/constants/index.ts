/**
 * Push Notification Constants
 */

export const PUSH_NOTIFICATION_ENDPOINTS = {
  REGISTER_TOKEN: '/method/parent_portal.api.push_notifications.register_token',
  UNREGISTER_TOKEN: '/method/parent_portal.api.push_notifications.unregister_token',
  SEND_TEST: '/method/parent_portal.api.push_notifications.send_test',
} as const;

export const NOTIFICATION_STORAGE_KEY = 'fcm-token';
export const NOTIFICATION_PERMISSION_REQUESTED_KEY = 'notification-permission-requested';
