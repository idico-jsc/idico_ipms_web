# Google OAuth Android Setup Guide

Complete guide for setting up Google OAuth authentication for Android native apps.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Google Cloud Console Setup](#google-cloud-console-setup)
- [Get SHA-1 Fingerprints](#get-sha-1-fingerprints)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Overview

This guide covers the setup of Google Sign-In for Android apps built with Capacitor. The authentication flow uses:
- **Web**: `@react-oauth/google` (popup-based OAuth)
- **Native (Android/iOS)**: `@codetrix-studio/capacitor-google-auth` (native dialog)

## Prerequisites

- Google Cloud Project with OAuth consent screen configured
- Android Debug Keystore (automatically created by Android SDK)
- Android Release Keystore (for production builds)

## Environment Variables

### 1. Configure in `.env.development`

```bash
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
# Android Build Configuration
VITE_ANDROID_PACKAGE_NAME=com.wellspring.parentportal
VITE_ANDROID_DEBUG_SHA1=CE:2F:41:F2:D1:94:0A:AA:CA:0C:F9:3C:4D:F4:4D:5D:86:D7:41:D7
VITE_ANDROID_RELEASE_SHA1=your-release-sha1-here
```

### 2. Environment Variable Usage

These variables are used:
- `VITE_GOOGLE_CLIENT_ID` - Web OAuth client ID (OAuth 2.0 Web Application)
  - ⚠️ **IMPORTANT**: Google requires the Web Client ID for `server_client_id` on native apps
  - DO NOT use Android Client ID here!
- `VITE_ANDROID_PACKAGE_NAME` - Android app package name
- `VITE_ANDROID_DEBUG_SHA1` - SHA-1 for debug builds (development)
- `VITE_ANDROID_RELEASE_SHA1` - SHA-1 for release builds (production)

## Google Cloud Console Setup

### Step 1: Create OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Configure the consent screen:
   - User Type: External (or Internal for Google Workspace)
   - App name: Parent Portal
   - User support email: your-email@example.com
   - Developer contact information: your-email@example.com
5. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
6. Save and continue

### Step 2: Create Web OAuth Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: "Parent Portal Web"
5. Authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-domain.com` (production)
6. Authorized redirect URIs:
   - `http://localhost:5173`
   - `https://your-domain.com`
7. Click **Create**
8. Copy the **Client ID** and set it as `VITE_GOOGLE_CLIENT_ID` in `.env.development`

### Step 3: Create Android OAuth Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Android**
4. Name: "Parent Portal Android"
5. Package name: `com.wellspring.parentportal` (from `VITE_ANDROID_PACKAGE_NAME`)
6. SHA-1 certificate fingerprint: See [Get SHA-1 Fingerprints](#get-sha-1-fingerprints) section
7. Click **Create**
8. The Android client will show a Client ID - this is your `VITE_GOOGLE_SERVER_CLIENT_ID`

**IMPORTANT**: You need to create **TWO** Android OAuth clients:
- One for debug builds (with debug SHA-1)
- One for release builds (with release SHA-1)

Or you can add multiple SHA-1 fingerprints to the same Android OAuth client.

## Get SHA-1 Fingerprints

### Debug Keystore SHA-1

The debug keystore is automatically created by Android SDK at `~/.android/debug.keystore`.

```bash
# Get SHA-1 for debug keystore
keytool -list -v -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android \
  -keypass android | grep SHA1

# Output example:
# SHA1: CE:2F:41:F2:D1:94:0A:AA:CA:0C:F9:3C:4D:F4:4D:5D:86:D7:41:D7
```

Copy this SHA-1 and:
1. Add it to your Android OAuth Client ID in Google Cloud Console
2. Set it as `VITE_ANDROID_DEBUG_SHA1` in `.env.development`

### Release Keystore SHA-1

For production builds, you need to create a release keystore:

```bash
# Create release keystore (if you don't have one)
keytool -genkey -v -keystore parent-portal-release.keystore \
  -alias parent-portal \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Get SHA-1 for release keystore
keytool -list -v -keystore parent-portal-release.keystore \
  -alias parent-portal | grep SHA1
```

Copy this SHA-1 and:
1. Add it to your Android OAuth Client ID in Google Cloud Console
2. Set it as `VITE_ANDROID_RELEASE_SHA1` in `.env.production`

### Add SHA-1 to Google Cloud Console

1. Go to **APIs & Services** → **Credentials**
2. Click on your **Android OAuth Client ID**
3. Click **Add fingerprint**
4. Paste the SHA-1 fingerprint
5. Click **Save**

**Note**: Changes can take 5-10 minutes to propagate.

## Testing

### Test on Web

1. Start dev server: `npm run dev`
2. Open `http://localhost:5173`
3. Click "Continue with Google"
4. Should open Google popup for authentication

### Test on Android

1. Build and sync: `npm run build:mobile`
2. Run on device/emulator: `npm run cap:run:android`
3. Click "Continue with Google"
4. Should open native Google Sign-In dialog
5. Select account and authenticate

### Common Test Scenarios

✅ **Success indicators:**
- Native Google Sign-In dialog appears
- Can select Google account
- Returns to app after authentication
- No error messages

❌ **Failure indicators:**
- "Failed to authenticate with Google" message
- No dialog appears
- Error 10 (Developer error)
- Blank screen after clicking button

## Troubleshooting

### Error: "Failed to authenticate with Google"

**Cause**: SHA-1 fingerprint not registered or incorrect

**Solution**:
1. Get your current SHA-1: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android | grep SHA1`
2. Verify it matches `VITE_ANDROID_DEBUG_SHA1` in `.env.development`
3. Verify it's registered in Google Cloud Console under your Android OAuth Client ID
4. Wait 5-10 minutes for changes to propagate
5. Rebuild and reinstall app: `npm run build:mobile && ./gradlew installDebug`

### Error 10: Developer Error

**Cause**: Configuration mismatch between app and Google Cloud Console

**Check**:
1. Package name matches: `com.wellspring.parentportal`
2. SHA-1 fingerprint is correct and registered
3. Using the correct Server Client ID (`VITE_GOOGLE_SERVER_CLIENT_ID`)
4. OAuth consent screen is configured

### No Google Sign-In Dialog Appears

**Cause**: Google Auth initialization failed

**Solution**:
1. Check logcat for errors: `adb logcat -d | grep GoogleAuth`
2. Verify `server_client_id` in `build/android/app/src/main/res/values/strings.xml`
3. Ensure Google Play Services is installed on device/emulator
4. Check that `GoogleAuth.initialize()` was called successfully

### SHA-1 Mismatch

**Symptoms**: Works in development but fails after building APK

**Cause**: Different keystores used for development and release

**Solution**:
1. Get SHA-1 from the keystore you're actually using
2. If using Android Studio's "Run" button, it uses debug keystore
3. If building APK manually, verify which keystore is being used
4. Register all SHA-1 fingerprints in Google Cloud Console

### Package Name Mismatch

**Symptoms**: Error 10, authentication fails

**Cause**: Package name doesn't match Google Cloud Console configuration

**Solution**:
1. Verify package name in `capacitor.config.ts`: `appId: 'com.wellspring.parentportal'`
2. Verify package name in Google Cloud Console Android OAuth Client
3. Verify `VITE_ANDROID_PACKAGE_NAME` in `.env.development`
4. All three must match exactly

### Server Client ID Not Found

**Symptoms**: App crashes on startup, "Given String is empty or null"

**Cause**: `server_client_id` not set in Android resources

**Solution**:
1. Ensure `VITE_GOOGLE_SERVER_CLIENT_ID` is set in `.env.development`
2. Run: `npm run setup:android`
3. Verify the generated file: `cat build/android/app/src/main/res/values/strings.xml`
4. Should contain: `<string name="server_client_id">your-client-id</string>`

### Changes Not Taking Effect

**Cause**: Cache or old build artifacts

**Solution**:
```bash
# Clean and rebuild
npm run build:mobile
npx cap sync android
./gradlew clean
./gradlew installDebug
```

## Environment Variables Reference

### Debug Build (.env.development)

```bash
VITE_GOOGLE_CLIENT_ID=378977509840-o6pb6vlgvh92slc7tvghvptqumd2isof.apps.googleusercontent.com
VITE_GOOGLE_SERVER_CLIENT_ID=378977509840-buhc8em6abfr9acit471eom94i0daes2.apps.googleusercontent.com
VITE_ANDROID_PACKAGE_NAME=com.wellspring.parentportal
VITE_ANDROID_DEBUG_SHA1=CE:2F:41:F2:D1:94:0A:AA:CA:0C:F9:3C:4D:F4:4D:5D:86:D7:41:D7
```

### Release Build (.env.production)

```bash
VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
VITE_GOOGLE_SERVER_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
VITE_ANDROID_PACKAGE_NAME=com.wellspring.parentportal
VITE_ANDROID_RELEASE_SHA1=your-release-sha1-here
```

## Quick Checklist

Before deploying, verify:

- [ ] Web OAuth Client ID created in Google Cloud Console
- [ ] Android OAuth Client ID created in Google Cloud Console
- [ ] Debug SHA-1 added to Android OAuth Client
- [ ] Release SHA-1 added to Android OAuth Client (for production)
- [ ] Package name matches in all places
- [ ] Environment variables set correctly
- [ ] `server_client_id` generated in strings.xml
- [ ] Tested on physical device or emulator with Google Play Services

## Related Documentation

- [GOOGLE_AUTH_NATIVE_SETUP.md](./GOOGLE_AUTH_NATIVE_SETUP.md) - Detailed native setup guide
- [BUILD_ANDROID_APK.md](./BUILD_ANDROID_APK.md) - Android build instructions
- [CAPACITOR_GUIDE.md](./CAPACITOR_GUIDE.md) - Capacitor usage guide
