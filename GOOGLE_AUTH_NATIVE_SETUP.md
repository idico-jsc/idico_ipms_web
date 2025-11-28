# Google Authentication for Native Mobile Apps

Complete guide for setting up Google OAuth for native Android and iOS applications using Capacitor.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Google Cloud Console Setup](#google-cloud-console-setup)
- [Android Configuration](#android-configuration)
- [iOS Configuration](#ios-configuration)
- [How It Works](#how-it-works)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Overview

This project uses different Google OAuth implementations for different platforms:

| Platform | Implementation | Login Flow |
|----------|---------------|------------|
| **Web** | `@react-oauth/google` | Popup/Redirect with web client ID |
| **Android** | `@codetrix-studio/capacitor-google-auth` | Native Google Sign-In with server client ID |
| **iOS** | `@codetrix-studio/capacitor-google-auth` | Native Google Sign-In with server client ID |

The app automatically detects the platform and uses the appropriate method.

## Prerequisites

1. **Google Cloud Project** with OAuth 2.0 credentials
2. **Two OAuth Client IDs** from Google Cloud Console:
   - **Web Client ID** - for web browser login
   - **Server Client ID** (Web application type) - for native mobile apps
3. **Android/iOS development environment** set up

## Environment Variables

### 1. Add to `.env.development` and `.env.production`

```env
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
# Server Client ID for native mobile apps (Android/iOS)
VITE_GOOGLE_SERVER_CLIENT_ID=your-server-client-id.apps.googleusercontent.com
```

### 2. Variables Explained

- **`VITE_GOOGLE_CLIENT_ID`**: Used for web browser login (popup flow)
- **`VITE_GOOGLE_SERVER_CLIENT_ID`**: Used for native Android/iOS login (native dialog)

**IMPORTANT**: Both values come from Google Cloud Console but serve different purposes.

## Google Cloud Console Setup

### Step 1: Create OAuth Client ID for Web (if not exists)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Application type**: **Web application**
6. Add **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   http://localhost:3000
   https://your-domain.com
   ```
7. Copy the **Client ID** → This is your `VITE_GOOGLE_CLIENT_ID`

### Step 2: Create OAuth Client ID for Server (Native Apps)

1. In the same **Credentials** page
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Application type**: **Web application**
4. Name it "Server Client ID for Native Apps"
5. **Do NOT add any authorized origins or redirect URIs** (not needed for native)
6. Copy the **Client ID** → This is your `VITE_GOOGLE_SERVER_CLIENT_ID`

### Step 3: Create Android OAuth Client ID

1. Click **Create Credentials** → **OAuth client ID**
2. Select **Application type**: **Android**
3. Enter **Package name**: `com.wellspring.parentportal`
4. Get your **SHA-1 fingerprint**:

   **For Debug (Development)**:
   ```bash
   cd build/android
   ./gradlew signingReport
   ```
   Look for "SHA1" under "Variant: debug"

   **For Release (Production)**:
   ```bash
   keytool -list -v -keystore /path/to/your/keystore.jks -alias your-key-alias
   ```

5. Enter the **SHA-1 certificate fingerprint**
6. Click **Create**
7. **You don't need to copy this Client ID** - it's automatically linked

### Step 4: Enable APIs

1. Go to **APIs & Services** → **Library**
2. Search and enable:
   - **Google+ API**
   - **Google Identity Toolkit API**

## Android Configuration

### Automatic Configuration

The project automatically generates Android resources from environment variables.

**How it works**:
1. When you run `npm run build:mobile` or `npm run cap:sync:android`
2. The script `scripts/setup-android-resources.js` runs automatically
3. It reads `VITE_GOOGLE_SERVER_CLIENT_ID` from your `.env` file
4. Generates `build/android/app/src/main/res/values/strings.xml` with the client ID

### Manual Verification

After running `npm run setup:android`, verify the file was created:

```bash
cat build/android/app/src/main/res/values/strings.xml
```

Should contain:
```xml
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <string name="app_name">Parent Portal</string>
    <string name="title_activity_main">Parent Portal</string>
    <string name="package_name">com.wellspring.parentportal</string>
    <string name="custom_url_scheme">com.wellspring.parentportal</string>
    <string name="server_client_id">YOUR_SERVER_CLIENT_ID_HERE</string>
</resources>
```

### Important Notes

- **Never edit files in `build/android` manually** - they get regenerated
- Always update `.env` files and run `npm run setup:android`
- The script runs automatically before syncing, so you don't need to run it manually

## iOS Configuration

### Configuration

The iOS configuration is handled in `capacitor.config.ts`:

```typescript
GoogleAuth: {
  scopes: ['profile', 'email'],
  serverClientId: process.env.VITE_GOOGLE_SERVER_CLIENT_ID,
  forceCodeForRefreshToken: true,
}
```

### iOS URL Scheme (if needed)

Add to `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR-CLIENT-ID</string>
    </array>
  </dict>
</array>
```

Replace `YOUR-CLIENT-ID` with the numeric part of your server client ID.

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│ GoogleButton Component                                   │
│ - Detects platform (web vs native)                      │
│ - Renders appropriate UI                                │
└─────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
    ┌────▼────┐                    ┌─────▼─────┐
    │   Web   │                    │  Native   │
    └────┬────┘                    └─────┬─────┘
         │                               │
         │ @react-oauth/google           │ @codetrix-studio/
         │ - Popup dialog                │   capacitor-google-auth
         │ - Web Client ID               │ - Native dialog
         │                               │ - Server Client ID
         │                               │
         └───────────────┬───────────────┘
                         │
                    ┌────▼────┐
                    │ID Token │
                    │  (JWT)  │
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │ Backend │
                    │Validation│
                    └─────────┘
```

### Code Flow

1. **Initialization** (`src/providers/google-oauth-provider.tsx`):
   ```typescript
   useEffect(() => {
     if (isNative()) {
       initializeGoogleAuth(); // Initialize native Google Auth
     }
   }, []);
   ```

2. **Button Click** (`src/features/auth/components/google-button.tsx`):
   ```typescript
   // On native platforms
   const handleNativeGoogleSignIn = async () => {
     const idToken = await signInWithGoogleNative(); // Native dialog
     onSuccess({ credential: idToken });
   };
   ```

3. **Native Sign In** (`src/utils/google-auth.ts`):
   ```typescript
   export const signInWithGoogleNative = async () => {
     const response = await GoogleAuth.signIn();
     return response.authentication.idToken;
   };
   ```

4. **Backend Verification**:
   - ID token sent to Frappe backend
   - Backend verifies token with Google
   - Creates/logs in user session

## Testing

### Test on Android

1. **Build and sync**:
   ```bash
   npm run build:mobile
   ```

2. **Run on device/emulator**:
   ```bash
   npm run cap:run:android
   ```

3. **Click "Login with Google"** - Native Google Sign-In dialog should appear

4. **Check logs** (if issues):
   ```bash
   # In Android Studio: View → Tool Windows → Logcat
   # Filter: package:com.wellspring.parentportal
   ```

### Test on Web

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Click "Login with Google"** - Web popup should appear

## Troubleshooting

### Android: "Developer Error" or "Error 10"

**Problem**: Android app shows error when clicking Google Sign-In

**Solutions**:

1. **Verify SHA-1 fingerprint** is added to Google Cloud Console:
   ```bash
   cd build/android
   ./gradlew signingReport
   ```
   Copy SHA1 and add to Google Cloud Console → Android OAuth Client

2. **Check server_client_id** is correct:
   ```bash
   cat build/android/app/src/main/res/values/strings.xml
   ```
   Should match `VITE_GOOGLE_SERVER_CLIENT_ID` in `.env`

3. **Re-sync** after adding SHA-1:
   ```bash
   npm run cap:sync:android
   ```
   Wait 5-10 minutes for Google to propagate changes

### Android: "Unable to resolve dependency"

**Problem**: Package name mismatch

**Solution**: Verify package name matches in:
- `capacitor.config.ts`: `appId: 'com.wellspring.parentportal'`
- Google Cloud Console → Android OAuth Client
- `build/android/app/build.gradle`: `applicationId`

### Web: "Origin not allowed"

**Problem**: Web origin not authorized

**Solution**: Add your origin to Google Cloud Console:
1. Go to Web OAuth Client
2. Add to **Authorized JavaScript origins**: `http://localhost:5173`
3. Wait 5-10 minutes

### "No ID token received"

**Problem**: Google Auth not initialized properly

**Solution**:
1. Check browser console for errors
2. Verify `VITE_GOOGLE_SERVER_CLIENT_ID` is set in `.env`
3. Restart app: `npm run cap:run:android`

### Environment variables not working

**Problem**: Changes to `.env` not reflected

**Solution**:
1. Rebuild: `npm run build:mobile`
2. Check generated file: `cat build/android/app/src/main/res/values/strings.xml`
3. Ensure you're editing the correct `.env` file (development vs production)

## Commands Reference

```bash
# Setup Android resources from environment variables
npm run setup:android

# Build web assets, setup Android, and sync to platforms
npm run build:mobile

# Sync to Android (auto-runs setup:android)
npm run cap:sync:android

# Build debug APK
npm run build:apk:debug

# Run on Android device/emulator
npm run cap:run:android

# Open in Android Studio
npm run cap:open:android
```

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different client IDs** for development and production
3. **Rotate credentials** regularly in production
4. **Restrict OAuth scopes** to only what's needed (`profile`, `email`)
5. **Verify ID tokens** on backend (never trust client-side only)

## Additional Resources

- [Capacitor Google Auth Plugin](https://github.com/CodetrixStudio/CapacitorGoogleAuth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Capacitor Documentation](https://capacitorjs.com/docs)

## Need Help?

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Verify all environment variables are set correctly
3. Check Android Studio Logcat for native errors
4. Ensure SHA-1 fingerprint is correct and added to Google Cloud Console
5. Wait 5-10 minutes after making changes in Google Cloud Console
