# Firebase Cloud Messaging (FCM) Setup Guide

Complete guide for setting up push notifications with Firebase Cloud Messaging.

## Overview

Firebase Cloud Messaging (FCM) enables push notifications across platforms:
- **Web**: Service Worker-based notifications
- **Android**: Native push notifications via Capacitor
- **iOS**: Native push notifications via Capacitor

## Prerequisites

- Firebase project created at [Firebase Console](https://console.firebase.google.com/)
- Firebase Admin SDK credentials for backend
- Google account with admin access

## Architecture

```
User Device → FCM Token Generated → Stored in Backend → Backend sends to FCM → Device receives notification
```

**Components**:
- Frontend: Token registration, notification handling
- Backend: Token storage, notification sending
- FCM: Message delivery infrastructure

## Firebase Console Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "Parent Portal")
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Add Web App

1. In project overview, click web icon (</>) to add web app
2. Register app with nickname (e.g., "Parent Portal Web")
3. Copy configuration values (apiKey, authDomain, etc.)
4. Click "Register app"

### 3. Add Android App

1. Click Android icon to add Android app
2. Enter package name: `com.wellspring.parentportal`
3. Enter app nickname (e.g., "Parent Portal Android")
4. Download `google-services.json`
5. Click "Register app"

### 4. Add iOS App (Optional, macOS only)

1. Click iOS icon to add iOS app
2. Enter bundle ID: `com.wellspring.parentportal`
3. Enter app nickname (e.g., "Parent Portal iOS")
4. Download `GoogleService-Info.plist`
5. Click "Register app"

### 5. Get Server Key

1. Go to Project Settings (gear icon)
2. Navigate to "Cloud Messaging" tab
3. Copy "Server key" - needed for backend
4. Copy "Sender ID" - needed for web config

## Environment Configuration

### Frontend Configuration

Create or update `.env.development` and `.env.production`:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# FCM Web Push Certificate (VAPID Key)
VITE_FIREBASE_VAPID_KEY=your-vapid-key
```

### Backend Configuration

Backend needs Firebase Admin SDK credentials. Store securely:

```env
# Firebase Admin SDK
FIREBASE_ADMIN_CREDENTIALS_PATH=/path/to/service-account-key.json
# OR
FIREBASE_ADMIN_CREDENTIALS_JSON={"type":"service_account",...}
```

## Get VAPID Key (Web Push Certificate)

1. In Firebase Console, go to Project Settings
2. Navigate to "Cloud Messaging" tab
3. Scroll to "Web configuration"
4. Click "Generate key pair" under "Web Push certificates"
5. Copy the key pair (VAPID key)
6. Save as `VITE_FIREBASE_VAPID_KEY` in `.env`

## Android Configuration

### 1. Place google-services.json

Copy downloaded `google-services.json` to:
```
build/android/app/google-services.json
```

### 2. Update Android Build Configuration

File: `build/android/build.gradle` (Project-level)

Add Google services classpath:
```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

File: `build/android/app/build.gradle` (App-level)

Add plugin at bottom:
```gradle
apply plugin: 'com.google.gms.google-services'
```

### 3. Auto-sync Configuration

The script `scripts/copy-config-files.cjs` automatically copies `google-services.json` when running:
- `npm run build:mobile`
- `npm run cap:sync`

## iOS Configuration (macOS only)

### 1. Place GoogleService-Info.plist

Copy downloaded `GoogleService-Info.plist` to:
```
build/ios/App/App/GoogleService-Info.plist
```

### 2. Configure in Xcode

1. Open project: `npm run cap:open:ios`
2. Add `GoogleService-Info.plist` to project (drag & drop)
3. Ensure "Copy items if needed" is checked
4. Add to "App" target

### 3. Enable Push Notifications Capability

In Xcode:
1. Select App target
2. Go to "Signing & Capabilities"
3. Click "+ Capability"
4. Add "Push Notifications"
5. Add "Background Modes" → Enable "Remote notifications"

## Implementation Overview

### Frontend Implementation

**File Structure**:
```
src/
├── config/firebase.ts          # Firebase initialization
├── services/fcm.ts             # FCM token management
├── hooks/usePushNotifications.ts  # React hook for notifications
└── utils/notification-handler.ts  # Handle incoming notifications
```

**Key Functions**:
- `initializeFirebase()` - Initialize Firebase app
- `requestNotificationPermission()` - Request user permission
- `getFCMToken()` - Get device FCM token
- `onMessageReceived()` - Handle foreground notifications
- `sendTokenToBackend()` - Register token with server

### Backend Implementation

**Required**:
- Firebase Admin SDK initialized
- Endpoint to receive and store FCM tokens
- Endpoint to send notifications via FCM

**Token Storage**:
- Store FCM token per user in database
- Link token to user account
- Support multiple devices per user
- Handle token refresh/invalidation

**Sending Notifications**:
- Use Firebase Admin SDK's `messaging().send()` method
- Support notification payload (title, body, icon)
- Support data payload (custom key-value pairs)
- Handle delivery failures and token cleanup

## Platform-Specific Setup

### Web Setup

**Service Worker**: Create `public/firebase-messaging-sw.js`

The service worker handles background notifications when app is closed.

**Requirements**:
- HTTPS (FCM requires secure origin, except localhost)
- Service worker must be in public root
- Configure VAPID key for web push

### Android Setup

**Permissions**: Automatically added by Capacitor Push Notifications plugin

**Icon**: Configure notification icon in Android resources
- Default: `res/drawable/notification_icon.png`
- Size: 24x24dp, white icon on transparent background

**Channel**: Configure notification channel for Android 8+
- Create channel with priority and sound settings
- Group notifications by category

### iOS Setup (macOS only)

**APNs Certificate**: Required for iOS push notifications
1. Go to Apple Developer account
2. Create APNs certificate for your app
3. Upload to Firebase Console (Project Settings → Cloud Messaging → iOS)

**Info.plist**: Add required permissions
```xml
<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

## Testing

### Test Web Notifications

1. Start dev server: `npm run dev`
2. Open browser DevTools → Console
3. Request notification permission
4. Copy FCM token from console
5. Send test notification from Firebase Console

### Test Android Notifications

1. Build and run: `npm run cap:run:android`
2. Grant notification permission when prompted
3. Check Logcat for FCM token
4. Send test notification from Firebase Console
5. Verify notification appears in system tray

### Test iOS Notifications (macOS only)

1. Build and run on physical device (push not supported in simulator)
2. Grant notification permission
3. Check Xcode console for FCM token
4. Send test notification from Firebase Console
5. Verify notification on device

### Send Test from Firebase Console

1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and text
4. Click "Send test message"
5. Enter FCM token
6. Click "Test"

## Notification Payload

### Notification Payload (Display)

```json
{
  "notification": {
    "title": "New Message",
    "body": "You have a new message from John",
    "icon": "/icon-192x192.png",
    "badge": "/badge-72x72.png",
    "image": "/notification-image.jpg",
    "click_action": "/messages"
  }
}
```

### Data Payload (Custom)

```json
{
  "data": {
    "type": "message",
    "messageId": "123",
    "senderId": "456",
    "customField": "value"
  }
}
```

**Use Cases**:
- Notification: User-visible messages (title, body)
- Data: Silent updates, app logic triggers
- Both: Rich notifications with custom actions

## Handling Notifications

### Foreground (App Open)

When app is active, handle notifications manually:
- Display custom in-app notification UI
- Update app state directly
- Show badge or alert

### Background (App Closed)

System handles notification display:
- Notification appears in system tray
- Tap opens app with notification data
- Handle in app resume/launch

### Click Actions

Handle notification clicks:
- Navigate to specific screen
- Open deep link
- Perform app action

## Token Management

### Token Lifecycle

**Generate**: On app first launch or after reinstall
**Refresh**: When token expires or changes
**Delete**: On logout or app uninstall

### Best Practices

1. **Request permission appropriately** - Don't request on first launch
2. **Store token server-side** - Link to user account
3. **Handle token refresh** - Listen for token updates
4. **Clean up on logout** - Remove token from backend
5. **Support multiple devices** - Store multiple tokens per user
6. **Handle failures gracefully** - Retry failed token uploads

## Troubleshooting

### Web: "Notification permission denied"

**Problem**: User denied notification permission

**Solution**:
- Guide user to browser settings to enable notifications
- Only request permission after user action (don't auto-request)
- Explain benefit of notifications before requesting

### Android: "google-services.json not found"

**Problem**: Configuration file missing

**Solution**:
1. Download from Firebase Console
2. Place in `build/android/app/google-services.json`
3. Run `npm run cap:sync:android`
4. Rebuild app

### iOS: "APNs certificate not configured"

**Problem**: Apple Push Notification certificate not set up

**Solution**:
1. Generate APNs certificate in Apple Developer account
2. Upload to Firebase Console → Project Settings → Cloud Messaging
3. Rebuild and test on physical device

### "Token registration failed"

**Problem**: Network error or backend not receiving token

**Solution**:
- Check network connectivity
- Verify backend endpoint is correct
- Check backend logs for errors
- Retry token upload with exponential backoff

### "Notifications not appearing"

**Problem**: Various causes

**Check**:
- Notification permission granted
- FCM token valid and registered
- Backend sending correct payload format
- Device notification settings enabled
- App in foreground vs background (different handling)

## Security Considerations

1. **Never expose Server Key** - Keep on backend only
2. **Validate tokens server-side** - Verify tokens with Firebase Admin SDK
3. **Use HTTPS** - Required for web push
4. **Sanitize notification content** - Prevent XSS in custom HTML
5. **Rate limit** - Prevent notification spam
6. **User preferences** - Allow users to control notification types

## Backend Integration

### Frappe/ERPNext Integration

If using Frappe backend, integrate FCM token storage:

**DocType**: Create "FCM Token" doctype
- `user` (Link to User)
- `token` (Text)
- `device_type` (Select: Web, Android, iOS)
- `created_at` (Datetime)

**API Endpoints**:
- `POST /api/method/your_app.api.fcm.register_token` - Register FCM token
- `DELETE /api/method/your_app.api.fcm.unregister_token` - Remove token
- `POST /api/method/your_app.api.fcm.send_notification` - Send notification (internal)

**Sending Notifications**:
Use Firebase Admin SDK in Frappe backend:
- Install: `pip install firebase-admin`
- Initialize with service account credentials
- Send via `messaging.send()` method

## Monitoring

Monitor notification delivery in Firebase Console:
- **Cloud Messaging** tab shows delivery stats
- Track sent, delivered, opened rates
- Identify issues with specific tokens or platforms
- View error messages and failure reasons

## Cost

Firebase Cloud Messaging is **free** for all usage tiers:
- Unlimited notifications
- No message limits
- Free for commercial use
- No hidden costs

**Note**: Other Firebase services (Firestore, Auth, etc.) have free tier limits.

## Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
- [Capacitor Push Notifications Plugin](https://capacitorjs.com/docs/apis/push-notifications)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)

## Related Documentation

- [MOBILE_GUIDE.md](./MOBILE_GUIDE.md) - Mobile development setup
- [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) - Google authentication
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Project architecture

---

**Version**: 1.0
**Last Updated**: 2025-12-09
**Platform Support**: Web, Android, iOS
