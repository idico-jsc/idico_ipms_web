# Capacitor Integration Guide

Complete guide for using Capacitor in the Parent Portal application.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Available Scripts](#available-scripts)
- [Utilities and Hooks](#utilities-and-hooks)
- [Platform Detection](#platform-detection)
- [Native Features](#native-features)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Overview

This project uses **Capacitor 7.4.3** to convert the React PWA into native iOS and Android applications. Capacitor allows us to:

- Build native mobile apps from web code
- Access native device features (App lifecycle, StatusBar, SplashScreen)
- Maintain a single codebase for web, iOS, and Android
- Use web-first development with optional native enhancements

### Key Information

- **App Name**: Parent Portal
- **Package ID**: com.wellspring.parentportal
- **Web Directory**: dist
- **Capacitor Version**: 7.4.3
- **Java Version Required**: 21
- **Node.js Version**: 20+

## Architecture

### Project Structure

```
react-ts-starter/
├── android/                          # Android native project (gitignored)
│   ├── app/
│   │   ├── src/main/assets/public/  # Web assets (synced from dist/)
│   │   └── build.gradle             # App build config
│   ├── build.gradle                 # Project build config
│   ├── gradle.properties            # Gradle settings
│   └── local.properties             # Local SDK path (gitignored)
├── ios/                             # iOS native project (gitignored)
│   └── App/App/public/              # Web assets (synced from dist/)
├── src/
│   ├── utils/capacitor.ts           # Capacitor utilities
│   └── hooks/use-capacitor.ts       # Capacitor React hooks
├── capacitor.config.ts              # Capacitor configuration
└── package.json                     # Scripts and dependencies
```

### Configuration Files

**capacitor.config.ts** - Main Capacitor configuration:
```typescript
{
  appId: 'com.wellspring.parentportal',
  appName: 'Parent Portal',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: { ... },
    StatusBar: { ... },
  }
}
```

**vite.config.ts** - Requires `base: './'` for Capacitor asset loading.

## Prerequisites

### Required Software

1. **Node.js 20+**
   ```bash
   node --version  # Should be 20.x or higher
   ```

2. **Java 21** (for Capacitor 7)
   ```bash
   java -version   # Should show openjdk 21.x.x
   ```

3. **Android Studio 2024.2.1+** (for Android development)
   - Android SDK (API 23+)
   - Gradle 8.7+

4. **Xcode 16.0+** (for iOS development, macOS only)
   - CocoaPods
   - iOS SDK

### Environment Verification

Run the Capacitor doctor command:
```bash
npm run cap:doctor
```

Expected output:
- ✅ All Capacitor dependencies at version 7.4.3
- ✅ Android looking great!
- ⚠️ Xcode not installed (expected on Linux)

## Available Scripts

### Build Scripts

```bash
# Build web assets only
npm run build

# Build and sync to all platforms
npm run build:mobile

# Build Android debug APK
npm run build:apk:debug

# Build Android release APK (requires signing)
npm run build:apk:release

# Build Android App Bundle for Play Store
npm run build:aab
```

### Capacitor Sync Scripts

```bash
# Sync web assets to all platforms
npm run cap:sync

# Sync to Android only
npm run cap:sync:android

# Sync to iOS only
npm run cap:sync:ios
```

### Development Scripts

```bash
# Open Android project in Android Studio
npm run cap:open:android

# Open iOS project in Xcode (macOS only)
npm run cap:open:ios

# Run on Android device/emulator
npm run cap:run:android

# Run on iOS device/simulator (macOS only)
npm run cap:run:ios
```

### Maintenance Scripts

```bash
# Update Capacitor dependencies
npm run cap:update

# Check environment setup
npm run cap:doctor
```

## Utilities and Hooks

### Capacitor Utilities (`src/utils/capacitor.ts`)

Import utilities:
```typescript
import {
  isNative,
  isIOS,
  isAndroid,
  isWeb,
  getPlatform,
  setStatusBarStyle,
  hideSplashScreen,
  getAppInfo,
  initializeCapacitor,
} from '@/utils/capacitor';
```

### Capacitor Hooks (`src/hooks/use-capacitor.ts`)

Import hooks:
```typescript
import {
  usePlatform,
  useAppState,
  useAppActiveState,
  useCapacitor,
  useBackButton,
} from '@/hooks/use-capacitor';
```

## Platform Detection

### Using Utilities

```typescript
import { isNative, isIOS, isAndroid, getPlatform } from '@/utils/capacitor';

// Check if running in native app
if (isNative()) {
  console.log('Running in native app');
}

// Platform-specific code
if (isIOS()) {
  // iOS-specific logic
}

if (isAndroid()) {
  // Android-specific logic
}

// Get platform name
const platform = getPlatform(); // 'ios' | 'android' | 'web'
```

### Using Hooks

```typescript
import { usePlatform } from '@/hooks/use-capacitor';

function MyComponent() {
  const { platform, isNative, isIOS, isAndroid, isWeb } = usePlatform();

  return (
    <div>
      <p>Platform: {platform}</p>
      {isNative && <p>Running in native app</p>}
      {isWeb && <p>Running in browser</p>}
    </div>
  );
}
```

## Native Features

### Status Bar

```typescript
import { setStatusBarStyle, setStatusBarColor } from '@/utils/capacitor';

// Set status bar style
await setStatusBarStyle(true);  // Dark style
await setStatusBarStyle(false); // Light style

// Set status bar color (Android only)
await setStatusBarColor('#000000');
```

### Splash Screen

```typescript
import { hideSplashScreen, showSplashScreen } from '@/utils/capacitor';

// Hide splash screen
await hideSplashScreen();

// Show splash screen
await showSplashScreen();
```

### App Information

```typescript
import { useAppInfo } from '@/hooks/use-capacitor';

function AppVersion() {
  const { appInfo, loading } = useAppInfo();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <p>Name: {appInfo?.name}</p>
      <p>Version: {appInfo?.version}</p>
      <p>Build: {appInfo?.build}</p>
    </div>
  );
}
```

### App State (Active/Background)

```typescript
import { useAppActiveState } from '@/hooks/use-capacitor';

function MyComponent() {
  const isActive = useAppActiveState();

  useEffect(() => {
    if (isActive) {
      console.log('App came to foreground');
    } else {
      console.log('App went to background');
    }
  }, [isActive]);

  return <div>App is {isActive ? 'active' : 'in background'}</div>;
}
```

### Back Button (Android)

```typescript
import { useBackButton } from '@/hooks/use-capacitor';

function MyComponent() {
  useBackButton(() => {
    console.log('Back button pressed on Android');
    // Handle back button logic
  });

  return <div>Content</div>;
}
```

### App Initialization

```typescript
import { initializeCapacitor } from '@/utils/capacitor';

// In your main App component or index
useEffect(() => {
  initializeCapacitor({
    statusBarStyle: 'dark',
    statusBarColor: '#000000',
    hideSplashScreen: true,
  });
}, []);
```

## Development Workflow

### Daily Development

1. **Web Development** (fastest iteration):
   ```bash
   npm run dev
   # Open http://localhost:5173
   # Test in browser with mobile simulation (Chrome DevTools: Ctrl+Shift+M)
   ```

2. **Test Changes on Android**:
   ```bash
   npm run build:mobile        # Build and sync
   npm run cap:run:android     # Run on device/emulator
   ```

3. **Incremental Updates**:
   ```bash
   npm run build               # Build web assets
   npm run cap:sync:android    # Sync to Android only
   ```

### When to Sync

You need to sync when:
- ✅ Web assets change (HTML, CSS, JS)
- ✅ Capacitor config changes
- ✅ New plugins installed
- ❌ NOT needed for code changes during `npm run dev`

### When to Rebuild Native

You need to rebuild native project when:
- ✅ New Capacitor plugins added
- ✅ Native configuration changes (build.gradle, Info.plist)
- ✅ First time setup
- ❌ NOT needed for web code changes

## Troubleshooting

### Common Issues

#### 1. Assets not loading in native app

**Symptom**: Blank screen or 404 errors in native app

**Solution**: Ensure `base: './'` is set in vite.config.ts
```typescript
export default defineConfig({
  base: './', // Required for Capacitor
  // ...
});
```

#### 2. Java version error

**Symptom**: `error: invalid source release: 21`

**Solution**: Verify Java 21 is installed and configured
```bash
java -version  # Should show Java 21
```

Check android/gradle.properties:
```properties
org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64
```

#### 3. Platform not detected

**Symptom**: `isNative()` returns false in native app

**Solution**: Ensure Capacitor imports are correct:
```typescript
import { Capacitor } from '@capacitor/core';
```

#### 4. Sync fails

**Symptom**: `npx cap sync` errors

**Solution**:
1. Rebuild web assets: `npm run build`
2. Check dist/ folder exists and has content
3. Verify capacitor.config.ts has correct webDir: 'dist'

#### 5. Android build fails

**Symptom**: Gradle build errors

**Solution**:
1. Verify Java 21: `java -version`
2. Check Android SDK path in android/local.properties
3. Clean and rebuild: `cd android && ./gradlew clean`

### Getting Help

1. **Check Capacitor Doctor**:
   ```bash
   npm run cap:doctor
   ```

2. **View Capacitor Logs**:
   - Android: Use Android Studio Logcat
   - iOS: Use Xcode Console

3. **Official Documentation**:
   - [Capacitor Docs](https://capacitorjs.com/docs)
   - [Capacitor Android](https://capacitorjs.com/docs/android)
   - [Capacitor iOS](https://capacitorjs.com/docs/ios)

## Next Steps

1. Read [BUILD_ANDROID_APK.md](./BUILD_ANDROID_APK.md) for Android build instructions
2. Read [MOBILE_DEVELOPMENT.md](./MOBILE_DEVELOPMENT.md) for development workflow
3. Explore [Capacitor Plugins](https://capacitorjs.com/docs/plugins) for additional native features
