// ========================================
// CUSTOM PUSH NOTIFICATION HANDLERS
// ========================================

/**
 * Handle incoming push notifications
 */
function receivePushNotification(event) {
  console.log('[Service Worker] Push Receiveds.')

  const { image, tag, url, title, text } = event.data.json().notification
  
  event.waitUntil(self.registration.showNotification(title, {
   body: text,
   icon: image,
   image: image,
   tag: tag,
   badge: 'https://spyna.it/icons/favicon.ico',
   data: {
        url: url || '/',
   },
   vibrate: [200, 100, 200],
   actions: [
     { action: 'Detail', title: 'View', icon: 'https://via.placeholder.com/128/ff0000' },
   ],        
  }))

}

/**
 * Handle notification click events
 */
function openPushNotification(event) {
  console.log('[Service Worker] Notification click Received.', event.notification.data)

  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data))
}

// Register push notification event listeners
self.addEventListener('push', receivePushNotification)
self.addEventListener('notificationclick', openPushNotification)

console.log('[Service Worker] Custom service worker with push notifications loaded')