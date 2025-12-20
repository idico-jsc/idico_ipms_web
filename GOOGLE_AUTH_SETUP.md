# Google Authentication Setup Guide

Complete guide for setting up Google OAuth across web and native mobile platforms.

## Platform Overview

| Platform | Implementation | Client ID Type |
|----------|---------------|----------------|
| **Web** | `@react-oauth/google` | Web Client ID |
| **Android/iOS** | `@codetrix-studio/capacitor-google-auth` | Server Client ID (Web application type) |

The app automatically detects the platform and uses the appropriate authentication method.

## Prerequisites

- Google Cloud Platform account with admin access
- OAuth consent screen configured
- Android/iOS development environment (for mobile apps)

## Environment Variables

Configure in both `.env.development` and `.env.production`:

```env
# Web browser login
VITE_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com

# Native mobile apps (Android/iOS)
VITE_GOOGLE_SERVER_CLIENT_ID=your-server-client-id.apps.googleusercontent.com

## Google Cloud Console Setup

### 1. Configure OAuth Consent Screen

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services → OAuth consent screen**
3. Select **External** (or Internal for Google Workspace)
4. Fill in required information:
   - App name: Your application name
   - User support email: Your email address
   - Developer contact email: Your email address
5. Add scopes: `userinfo.email`, `userinfo.profile`
6. Add test users if app is in testing mode
7. Save and continue

### 2. Create Web OAuth Client ID

For web browser authentication:

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Name: "Your App Web"
5. Add **Authorized JavaScript origins**:
   - Development: `http://localhost:5173`
   - Production: `https://your-domain.com`
6. Click Create
7. Copy the Client ID → Use as `VITE_GOOGLE_CLIENT_ID`

**Important**: Add the exact URL from your browser's address bar (no trailing slashes, include port number).

### 3. Create Server Client ID (for Native Apps)

For Android/iOS native authentication:

1. Click **Create Credentials → OAuth client ID**
2. Application type: **Web application**
3. Name: "Server Client ID for Native Apps"
4. **Do NOT add authorized origins or redirect URIs** (not needed for native)
5. Copy the Client ID → Use as `VITE_GOOGLE_SERVER_CLIENT_ID`

### 4. Create Android OAuth Client ID

For native Android authentication:

1. Click **Create Credentials → OAuth client ID**
2. Application type: **Android**
3. Package name: `com.wellspring.parentportal`
4. Add SHA-1 certificate fingerprints (see below)
5. Click Create

**Note**: The Android Client ID is automatically linked, you don't need to copy it.

### 5. Enable Required APIs

Go to **APIs & Services → Library** and enable:
- Google+ API
- Google Identity Toolkit API

## Android SHA-1 Configuration

### Get Debug SHA-1

For development builds:

```bash
# Method 1: Using debug keystore
keytool -list -v -keystore ~/.android/debug.keystore \
  -alias androiddebugkey \
  -storepass android \
  -keypass android | grep SHA1

# Method 2: Using Gradle
cd build/android
./gradlew signingReport
# Look for "SHA1" under "Variant: debug"
```

### Get Release SHA-1

For production builds, create a release keystore:

```bash
# Create release keystore
keytool -genkey -v -keystore parent-portal-release.keystore \
  -alias parent-portal \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Get SHA-1 from release keystore
keytool -list -v -keystore parent-portal-release.keystore \
  -alias parent-portal | grep SHA1
```

### Add SHA-1 to Google Cloud Console

1. Go to **APIs & Services → Credentials**
2. Click on your Android OAuth Client ID
3. Click **Add fingerprint**
4. Paste the SHA-1 fingerprint
5. Click Save
6. Wait 5-10 minutes for changes to propagate

**Best Practice**: Add both debug and release SHA-1 fingerprints to the same Android OAuth Client.

## iOS Configuration (macOS only)

The iOS configuration is handled automatically in `capacitor.config.ts`. No additional manual setup required.

If needed, add URL scheme to `ios/App/App/Info.plist`:

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

## Testing

### Web Testing

1. Start dev server: `npm run dev`
2. Navigate to login page
3. Click "Login with Google"
4. Google popup should appear for authentication

### Android Testing

1. Build and sync: `npm run build:mobile`
2. Run on device: `npm run cap:run:android`
3. Click "Login with Google"
4. Native Google Sign-In dialog should appear

### iOS Testing (macOS only)

1. Build and sync: `npm run build:mobile`
2. Open Xcode: `npm run cap:open:ios`
3. Select device/simulator and run
4. Click "Login with Google"

## Troubleshooting

### "Origin not allowed for the given client ID"

**Problem**: Frontend URL not authorized in Google Cloud Console

**Solution**:
1. Check exact URL in browser (e.g., `http://localhost:5173`)
2. Add to Google Cloud Console → Web OAuth Client → Authorized JavaScript origins
3. Ensure no trailing slash, include port number
4. Wait 5-10 minutes for changes to propagate
5. Clear browser cache

**Common mistakes**:
- Missing port number: `http://localhost` instead of `http://localhost:5173`
- Added trailing slash: `http://localhost:5173/`
- Different origins: `localhost` vs `127.0.0.1`

### Android: "Developer Error" or "Error 10"

**Problem**: SHA-1 fingerprint not registered or incorrect

**Solution**:
1. Get current SHA-1: `./gradlew signingReport` (in `build/android`)
2. Verify it matches `VITE_ANDROID_DEBUG_SHA1` in `.env`
3. Add to Google Cloud Console → Android OAuth Client
4. Wait 5-10 minutes
5. Rebuild: `npm run build:mobile`

### "Invalid Client ID"

**Problem**: Client ID mismatch between `.env` and Google Cloud Console

**Solution**:
1. Copy Client ID from Google Cloud Console again
2. Update `.env.development` or `.env.production`
3. Remove extra spaces or characters
4. Restart dev server or rebuild mobile app

### Google Login Button Not Appearing

**Problem**: Environment variable not configured

**Solution**:
1. Verify `VITE_GOOGLE_CLIENT_ID` in `.env.development`
2. Ensure variable name is exact (starts with `VITE_`)
3. Restart dev server
4. Check browser console for errors

### Backend Authentication Error (401)

**Problem**: Frappe backend configuration issue

**Solution**:
1. Verify Social Login Key configured in Frappe
2. Ensure Client ID and Client Secret match Google Cloud Console
3. Check Frappe backend accepts `id_token` parameter
4. Verify user email matches Google account email
5. Check Frappe logs: `bench logs`

### Package Name Mismatch

**Problem**: Android package name doesn't match across configurations

**Solution**: Verify package name matches in:
- `capacitor.config.ts`: `appId: 'com.wellspring.parentportal'`
- Google Cloud Console → Android OAuth Client
- `build/android/app/build.gradle`: `applicationId`

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Keep Client Secret secure** - only store on backend
3. **Use different credentials** for development and production
4. **Regularly rotate secrets** in production
5. **Restrict OAuth scopes** to only required permissions (`profile`, `email`)
6. **Monitor OAuth usage** in Google Cloud Console
7. **Use HTTPS in production**
8. **Configure CORS** properly on backend
9. **Implement rate limiting** for login attempts

## Quick Verification Checklist

Before deploying, verify:

- [ ] Web OAuth Client ID created
- [ ] Server Client ID created (for native apps)
- [ ] Android OAuth Client ID created (if building Android)
- [ ] iOS OAuth Client ID created (if building iOS)
- [ ] Debug SHA-1 added (for development)
- [ ] Release SHA-1 added (for production)
- [ ] Package name matches everywhere
- [ ] Environment variables set correctly
- [ ] OAuth consent screen published (for production)
- [ ] Test users added (if in testing mode)
- [ ] Tested on physical device with Google Play Services

## Need Help?

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Verify all environment variables
3. Check browser console / Android Logcat for errors
4. Ensure SHA-1 fingerprints are correct
5. Wait 5-10 minutes after Google Cloud Console changes
6. Verify URLs match exactly (protocol, domain, port)

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- [Capacitor Google Auth Plugin](https://github.com/CodetrixStudio/CapacitorGoogleAuth)
- [Frappe OAuth Documentation](https://frappeframework.com/docs/v14/user/en/guides/integration/oauth)
