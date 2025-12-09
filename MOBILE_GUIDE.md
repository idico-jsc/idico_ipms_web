# Mobile Development Guide

Complete guide for developing native iOS and Android applications with Capacitor.

## Overview

This project uses Capacitor 7 to convert the React PWA into native mobile apps. Benefits:
- Build native apps from single React codebase
- Access native device features (App lifecycle, StatusBar, SplashScreen, etc.)
- Web-first development with optional native enhancements
- Maintain 100% code sharing across web/iOS/Android

**Key Information**:
- Capacitor Version: 7.4.3
- Package ID: com.wellspring.parentportal
- App Name: Parent Portal
- Java Version: 21 (required)
- Node.js: 20+

## Prerequisites

### Required Software

**1. Node.js 20+**
```bash
node --version  # Should be 20.x or higher
```

**2. Java 21** (Capacitor 7 requirement)
```bash
java -version   # Should show openjdk 21.x.x
```

Installation (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install -y openjdk-21-jdk
```

**3. Android Studio 2024.2.1+** (for Android)
- Download from https://developer.android.com/studio
- Install Android SDK (API 23+)
- Install Gradle 8.7+
- Configure Android SDK path

**4. Xcode 16.0+** (for iOS, macOS only)
- Install from Mac App Store
- Install Command Line Tools: `xcode-select --install`
- Install CocoaPods: `sudo gem install cocoapods`

### Environment Verification

Check dependencies:
```bash
npm run cap:doctor

# Expected output:
# ✅ @capacitor/cli: 7.4.3
# ✅ @capacitor/android: 7.4.3
# ✅ Android looking great! 👌
```

## Project Structure

```
react-ts-starter/
├── build/
│   ├── android/                    # Android native project (gitignored)
│   │   ├── app/
│   │   │   ├── src/main/assets/public/  # Web build synced here
│   │   │   └── build.gradle       # App-level build config (Java 21)
│   │   ├── build.gradle           # Project-level config
│   │   └── gradle.properties      # Gradle settings
│   └── ios/                       # iOS native project (gitignored)
│       └── App/App/public/        # Web build synced here
├── src/
│   ├── utils/capacitor.ts         # Platform detection utilities
│   └── hooks/use-capacitor.ts     # Capacitor React hooks
├── capacitor.config.ts            # Capacitor configuration
└── vite.config.ts                 # Requires base: './' for assets
```

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Web Assets
```bash
npm run build
```

### 3. Sync to Platforms
```bash
# Sync to all platforms
npm run cap:sync

# Sync to specific platform
npm run cap:sync:android
```

### 4. Configure Environment

Create `.env.development` and `.env.production` with required variables:
```env
VITE_API_BASE_URL=https://your-api.com
VITE_FRAPPE_URL=https://your-frappe.com
# Add other platform-specific variables
```

## Daily Development Workflow

### Recommended Workflow

1. **Web Development** (Fastest iteration)
   - Start dev server: `npm run dev`
   - Test in browser with DevTools
   - Use Chrome DevTools device emulation
   - Platform detection works in browser

2. **Build & Sync** (When ready for device testing)
   - Build web assets: `npm run build`
   - Sync to platforms: `npm run cap:sync`

3. **Test on Device/Emulator**
   - Android: `npm run cap:run:android`
   - iOS: `npm run cap:run:ios` (macOS only)

4. **Debug Native Issues**
   - Open in IDE: `npm run cap:open:android` or `npm run cap:open:ios`
   - Use native debugging tools

### Best Practices

- **Develop in browser first** - 90% of work can be done in browser
- **Use platform detection** - Check `isNative()`, `isAndroid()`, `isIOS()`
- **Test native features on real devices** - Emulators don't catch all issues
- **Sync frequently** - After changing native configs or assets
- **Clean build if issues** - `./gradlew clean` (in `build/android`)

## Building APK/AAB

### Build Types

**Debug APK** - For development and testing
- Not optimized
- Console logs enabled
- Can install directly on devices
- Auto-signed with debug keystore

**Release APK** - For production (non-Play Store)
- Optimized and minified
- Requires signing
- Smaller file size

**AAB (App Bundle)** - For Google Play Store
- Google Play's preferred format
- Dynamic delivery
- Smaller downloads

### Build Commands

**Debug APK**:
```bash
npm run build:apk:debug
# Output: build/android/app/build/outputs/apk/debug/pp-<version>-debug.apk
```

**Release APK**:
```bash
npm run build:apk:release
# Output: build/android/app/build/outputs/apk/release/pp-<version>-release.apk
```

**AAB (App Bundle)**:
```bash
npm run build:aab
# Output: build/android/app/build/outputs/bundle/release/app-release.aab
```

### Automatic APK Naming

APKs are automatically renamed to: `pp-<version>-<buildType>.apk`
- `pp` = Parent Portal
- `<version>` = From package.json
- `<buildType>` = debug or release

Examples: `pp-0.0.90-debug.apk`, `pp-1.2.5-release.apk`

### Signing Configuration (Production)

For release builds, create signing configuration:

**1. Generate release keystore**:
```bash
keytool -genkey -v -keystore parent-portal-release.keystore \
  -alias parent-portal \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**2. Configure Gradle signing** (in `build/android/app/build.gradle`):
```gradle
android {
    signingConfigs {
        release {
            storeFile file("/path/to/parent-portal-release.keystore")
            storePassword "your-keystore-password"
            keyAlias "parent-portal"
            keyPassword "your-key-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

**Security**: Never commit keystore passwords to version control. Use environment variables or secure storage.

## Platform Detection & Native Features

### Platform Detection

Use built-in utilities to detect platform:

**Utilities** (`src/utils/capacitor.ts`):
- `isNative()` - Returns true if running in Capacitor app
- `isWeb()` - Returns true if running in browser
- `isAndroid()` - Returns true if Android app
- `isIOS()` - Returns true if iOS app
- `getPlatform()` - Returns 'web', 'android', or 'ios'

**Hooks** (`src/hooks/use-capacitor.ts`):
- `usePlatform()` - Get platform info with reactive updates
- `useAppState()` - Monitor app active/background state
- `useBackButton()` - Handle Android back button
- `useAppInfo()` - Get app version and build info

### Available Native Features

Installed plugins:
- `@capacitor/app` - App lifecycle, info, URLs
- `@capacitor/splash-screen` - Splash screen control
- `@capacitor/status-bar` - Status bar styling
- `@capacitor/browser` - Open external URLs
- `@capacitor/push-notifications` - Push notifications
- `@codetrix-studio/capacitor-google-auth` - Google OAuth

Add more plugins as needed:
```bash
npm install @capacitor/camera
npm run cap:sync
```

### Graceful Degradation

Always provide fallback for web:

**Pattern**:
1. Check if feature is available
2. Use native feature if available
3. Provide web alternative
4. Handle errors gracefully

**Example approach**:
- Check `isNative()` before calling native APIs
- Provide web-compatible alternatives
- Show appropriate UI based on platform

## Testing Strategies

### Web Testing
- Use Chrome DevTools device emulation
- Test responsive layouts
- Verify platform detection works in browser

### Android Testing

**Using Android Studio**:
1. Open project: `npm run cap:open:android`
2. Wait for Gradle sync
3. Select device/emulator
4. Click Run

**Using CLI**:
```bash
# Run on connected device
npm run cap:run:android

# Install APK manually
adb install pp-0.0.90-debug.apk
```

**View logs**:
```bash
# Realtime logs
adb logcat

# Filter by package
adb logcat | grep com.wellspring.parentportal
```

### iOS Testing (macOS only)

1. Open Xcode: `npm run cap:open:ios`
2. Select device/simulator
3. Click Run
4. View logs in Xcode console

## Debugging

### Web Debugging
- Chrome DevTools
- React DevTools extension
- Network tab for API calls

### Android Debugging

**Logcat** (in Android Studio):
- View → Tool Windows → Logcat
- Filter by package: `com.wellspring.parentportal`

**Chrome DevTools** (for WebView):
1. Connect Android device via USB
2. Enable USB debugging
3. Open `chrome://inspect` in Chrome
4. Click "inspect" on your app

### iOS Debugging

**Safari Web Inspector** (for WebView):
1. Enable Safari Developer menu: Safari → Preferences → Advanced → Show Develop menu
2. Connect iOS device
3. Safari → Develop → [Your Device] → [Your App]

## Performance Optimization

### Web Bundle
- Code splitting by route
- Lazy loading components
- Image optimization (WebP)
- Compression (gzip)
- PWA caching

### Mobile App
- Minimize APK size with ProGuard
- Optimize images and assets
- Lazy load native features
- Efficient state management
- Profile with Android Studio Profiler

## Common Issues & Solutions

### "Java version mismatch"
**Problem**: Wrong Java version installed

**Solution**: Install Java 21 and set as default

### "Gradle build failed"
**Problem**: Gradle configuration or dependency issue

**Solution**:
```bash
cd build/android
./gradlew clean
./gradlew build --stacktrace
```

### "APK not installing"
**Problem**: Signature mismatch or incompatible architecture

**Solution**:
- Uninstall old version first
- Ensure device architecture matches (arm64, x86)
- Check minimum SDK version (API 23+)

### "White screen on startup"
**Problem**: Web assets not synced or wrong path

**Solution**:
```bash
npm run build
npm run cap:sync
```

Verify `vite.config.ts` has `base: './'`

### "Native plugin not working"
**Problem**: Plugin not synced or initialized

**Solution**:
```bash
npm run cap:sync
# Then rebuild app
```

### "Changes not reflecting in app"
**Problem**: Old build cached

**Solution**:
```bash
npm run build:mobile  # Rebuilds and syncs
# Or manually:
npm run build
npm run cap:sync
```

## Available NPM Scripts

**Development**:
- `npm run dev` - Start Vite dev server
- `npm run build` - Build web assets only
- `npm run preview` - Preview production build

**Mobile Build**:
- `npm run build:mobile` - Build web + setup Android + sync
- `npm run build:apk:debug` - Build debug APK (auto-named)
- `npm run build:apk:release` - Build release APK (auto-named)
- `npm run setup:android` - Setup Android resources from env vars

**Capacitor**:
- `npm run cap:sync` - Sync to all platforms
- `npm run cap:sync:android` - Sync to Android only
- `npm run cap:open:android` - Open in Android Studio
- `npm run cap:run:android` - Build and run on device
- `npm run cap:doctor` - Verify environment

## Configuration Files

### capacitor.config.ts
Main Capacitor configuration:
- `appId` - Package name/Bundle ID
- `appName` - Display name
- `webDir` - Build output directory
- `plugins` - Plugin configurations

### vite.config.ts
**Critical**: Must have `base: './'` for Capacitor to load assets correctly.

### Android Configuration
- `build/android/app/build.gradle` - App-level config
- `build/android/build.gradle` - Project-level config
- `build/android/gradle.properties` - Gradle settings (Java 21)

## Security Considerations

1. **Environment variables** - Never commit `.env` files
2. **Keystore files** - Store securely, never commit
3. **API keys** - Use environment-specific keys
4. **Permissions** - Request only needed permissions
5. **HTTPS** - Always use HTTPS in production
6. **Code obfuscation** - Enable ProGuard for release builds

## Deployment Checklist

Before deploying to production:

- [ ] Update app version in `package.json`
- [ ] Configure release signing keystore
- [ ] Set production environment variables
- [ ] Test on physical devices (Android & iOS)
- [ ] Verify all native features work
- [ ] Check app performance
- [ ] Test on different Android versions
- [ ] Verify deep links work
- [ ] Test push notifications
- [ ] Review app permissions
- [ ] Optimize bundle size
- [ ] Enable ProGuard/R8
- [ ] Create release build and test installation

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/)
- [iOS Developer Guide](https://developer.apple.com/)
- [Vite Documentation](https://vitejs.dev/)

## Need Help?

If you encounter issues:
1. Run `npm run cap:doctor` to verify environment
2. Check this guide's troubleshooting section
3. Review Capacitor documentation
4. Check platform-specific logs (Logcat for Android)
5. Verify all prerequisites are installed correctly
