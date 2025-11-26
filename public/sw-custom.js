// ========================================
// CUSTOM SERVICE WORKER - PUSH NOTIFICATIONS
// ========================================
// This file contains custom push notification logic
// It is imported by sw.js (the main service worker)

/**
 * Handle incoming push notifications
 */
function receivePushNotification(event) {
  console.log('[Service Worker] Push Received.');

  const { image, tag, url, title, text } = event.data.json();

  const options = {
    data: url,
    body: text,
    icon: image,
    vibrate: [200, 100, 200],
    tag: tag,
    image: image,
    badge: 'https://spyna.it/icons/favicon.ico',
    actions: [{ action: 'Detail', title: 'View', icon: 'https://via.placeholder.com/128/ff0000' }]
  };

  event.waitUntil(self.registration.showNotification(title, options));
}

/**
 * Handle notification click events
 */
function openPushNotification(event) {
  console.log('[Service Worker] Notification click Received.', event.notification.data);

  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

// Register event listeners
self.addEventListener('push', receivePushNotification);
self.addEventListener('notificationclick', openPushNotification);

console.log('[Service Worker] Custom push notification handlers loaded');
