# Capacitor Implementation Guide

Complete step-by-step guide to implement Capacitor in a React + TypeScript + Vite project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Overview](#overview)
- [Step 1: Install Capacitor](#step-1-install-capacitor)
- [Step 2: Initialize Capacitor](#step-2-initialize-capacitor)
- [Step 3: Configure Vite](#step-3-configure-vite)
- [Step 4: Add Native Platforms](#step-4-add-native-platforms)
- [Step 5: Configure Android Build](#step-5-configure-android-build)
- [Step 6: Create Utilities and Hooks](#step-6-create-utilities-and-hooks)
- [Step 7: Add NPM Scripts](#step-7-add-npm-scripts)
- [Step 8: Update .gitignore](#step-8-update-gitignore)
- [Step 9: Build and Test](#step-9-build-and-test)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have:

### Required Software

1. **Node.js 20+**
   ```bash
   node --version  # Should be 20.x or higher
   ```

2. **Java 21** (Required for Capacitor 7)
   ```bash
   java -version   # Should show openjdk 21.x.x
   ```

   If not installed:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install -y openjdk-21-jdk

   # Verify installation
   java -version
   ```

3. **Android Studio 2024.2.1+** (for Android development)
   - Download from https://developer.android.com/studio
   - Install Android SDK (API 23+)
   - Set up Android SDK path

4. **Xcode 16.0+** (for iOS development, macOS only)
   - Install from Mac App Store
   - Install Command Line Tools: `xcode-select --install`
   - Install CocoaPods: `sudo gem install cocoapods`

### Project Requirements

- React 18+ project with TypeScript
- Vite as build tool
- Working build setup (`npm run build` produces output)

## Overview

Capacitor converts your web app into native iOS and Android applications. The implementation involves:

1. Installing Capacitor packages
2. Configuring Capacitor
3. Adjusting Vite config for native asset loading
4. Adding Android/iOS platforms
5. Creating utilities for native features
6. Building native apps

**Estimated Time**: 30-60 minutes

## Step 1: Install Capacitor

### 1.1 Install Core Packages

```bash
npm install @capacitor/core
npm install -D @capacitor/cli
```

**What this does**: Installs Capacitor runtime and CLI tools.

### 1.2 Install Platform Packages

```bash
npm install @capacitor/android @capacitor/ios
```

**What this does**: Adds Android and iOS platform support.

### 1.3 Install Essential Plugins

```bash
npm install @capacitor/app @capacitor/splash-screen @capacitor/status-bar
```

**What this does**:
- `@capacitor/app` - App lifecycle, deep links, back button
- `@capacitor/splash-screen` - Control splash screen display
- `@capacitor/status-bar` - Style status bar (iOS/Android)

### 1.4 Verify Installation

```bash
npm list @capacitor/core
# Should show @capacitor/core@7.x.x
```

## Step 2: Initialize Capacitor

### 2.1 Run Capacitor Init

```bash
npx cap init
```

You'll be prompted for:
- **App name**: Your app's display name (e.g., "My App")
- **Package ID**: Reverse domain notation (e.g., "com.company.appname")
- **Web asset directory**: `dist` (Vite's default output)

Example:
```
? App name: Parent Portal
? App package ID: com.company.parentportal
? Web asset directory: dist
```

### 2.2 Verify capacitor.config.ts

The init command creates `capacitor.config.ts`. Verify it looks like this:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.company.parentportal',
  appName: 'Parent Portal',
  webDir: 'dist',
};

export default config;
```

### 2.3 Add Plugin Configuration (Optional)

Enhance the config with plugin settings:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.company.parentportal',
  appName: 'Parent Portal',
  webDir: 'dist',
  server: {
    androidScheme: 'https', // Use HTTPS scheme for Android
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#000000',
    },
  },
};

export default config;
```

## Step 3: Configure Vite

### 3.1 Update vite.config.ts

**Critical**: Capacitor requires relative asset paths.

Add `base: './'` to your Vite config:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: './', // ← ADD THIS LINE (Required for Capacitor)
  plugins: [react()],
  // ... rest of your config
});
```

**Why**: Native apps load assets via `file://` protocol. Absolute paths (`/assets/...`) won't work, but relative paths (`./assets/...`) will.

### 3.2 Verify Build Output

```bash
npm run build
```

Check `dist/index.html` - asset paths should be relative:
```html
<!-- ✅ Correct (relative paths) -->
<script src="./assets/index-abc123.js"></script>
<link href="./assets/index-abc123.css" rel="stylesheet">

<!-- ❌ Wrong (absolute paths) -->
<script src="/assets/index-abc123.js"></script>
<link href="/assets/index-abc123.css" rel="stylesheet">
```

## Step 4: Add Native Platforms

### 4.1 Build Web Assets First

```bash
npm run build
```

**Important**: Always build before adding platforms or syncing.

### 4.2 Add Android Platform

```bash
npx cap add android
```

**What this does**:
- Creates `android/` folder with complete Android project
- Copies web assets to `android/app/src/main/assets/public/`
- Installs Capacitor plugins for Android
- Sets up Gradle build system

**Expected output**:
```
✔ Adding native android project in android in 2.50s
✔ Installing NPM dependencies
✔ add in 12.34s
✔ Copying web assets from dist to android/app/src/main/assets/public in 123ms
✔ Creating capacitor.config.json in android/app/src/main/assets in 1.23ms
✔ copy android in 145ms
```

### 4.3 Add iOS Platform

```bash
npx cap add ios
```

**What this does**:
- Creates `ios/` folder with complete Xcode project
- Copies web assets to `ios/App/App/public/`
- Installs Capacitor plugins for iOS
- Creates Podfile for CocoaPods dependencies

**Note**: Can't build iOS on Linux (requires macOS), but the project is created and ready.

### 4.4 Sync Web Assets

```bash
npx cap sync
```

**What this does**: Copies web assets and updates plugins on both platforms.

**Run this command whenever**:
- Web assets change (after `npm run build`)
- Capacitor config changes
- New plugins are installed

## Step 5: Configure Android Build

### 5.1 Configure Java 21 in app/build.gradle

Edit `android/app/build.gradle`:

Find the `android {` block and add `compileOptions`:

```gradle
android {
    namespace "com.company.parentportal"
    compileSdk rootProject.ext.compileSdkVersion

    // ADD THIS BLOCK ↓
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_21
        targetCompatibility JavaVersion.VERSION_21
    }
    // ADD THIS BLOCK ↑

    defaultConfig {
        applicationId "com.company.parentportal"
        // ... rest of config
    }
}
```

### 5.2 Configure Java 21 in build.gradle

Edit `android/build.gradle`:

Find the `allprojects {` block and add Java configuration:

```gradle
allprojects {
    repositories {
        google()
        mavenCentral()
    }
    // ADD THIS BLOCK ↓
    tasks.withType(JavaCompile).configureEach {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }
    // ADD THIS BLOCK ↑
}
```

### 5.3 Create local.properties

Create `android/local.properties`:

```properties
sdk.dir=/home/YOUR_USERNAME/Android/Sdk
```

Replace `YOUR_USERNAME` with your actual username, or use:

```bash
echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
```

### 5.4 Update gradle.properties

Edit `android/gradle.properties` and add:

```properties
# Add this line at the end
org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64
```

Adjust path if your Java 21 is installed elsewhere:
```bash
# Find Java 21 path
which java | xargs readlink -f | sed 's|/bin/java||'
```

### 5.5 Fix Duplicate Resources (If Using Compression)

If your Vite config uses `vite-plugin-compression2`, you need to exclude compressed files from Android assets.

Edit `android/app/build.gradle`, find `aaptOptions` and update the pattern:

```gradle
defaultConfig {
    // ... other settings
    aaptOptions {
        // ADD :!*.gz:!*.br to the end of the pattern ↓
        ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~:!*.gz:!*.br'
    }
}
```

### 5.6 Verify Android Configuration

```bash
cd android
./gradlew --version
cd ..
```

Should show:
```
Gradle 8.x.x
...
JVM:          21.0.x
```

## Step 6: Create Utilities and Hooks

### 6.1 Create Capacitor Utilities

Create `src/utils/capacitor.ts`:

```typescript
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Platform Detection
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};

export const getPlatform = (): 'ios' | 'android' | 'web' => {
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

/**
 * Status Bar
 */
export const setStatusBarStyle = async (isDark: boolean): Promise<void> => {
  if (!isNative()) return;
  try {
    await StatusBar.setStyle({
      style: isDark ? Style.Dark : Style.Light,
    });
  } catch (error) {
    console.error('Error setting status bar style:', error);
  }
};

export const setStatusBarColor = async (color: string): Promise<void> => {
  if (!isAndroid()) return;
  try {
    await StatusBar.setBackgroundColor({ color });
  } catch (error) {
    console.error('Error setting status bar color:', error);
  }
};

/**
 * Splash Screen
 */
export const hideSplashScreen = async (): Promise<void> => {
  if (!isNative()) return;
  try {
    await SplashScreen.hide();
  } catch (error) {
    console.error('Error hiding splash screen:', error);
  }
};

/**
 * App Info
 */
export const getAppInfo = async () => {
  if (!isNative()) {
    return {
      name: 'My App',
      id: 'com.company.app',
      version: import.meta.env.VITE_APP_VERSION || '0.0.0',
      build: '1',
    };
  }

  try {
    return await App.getInfo();
  } catch (error) {
    console.error('Error getting app info:', error);
    return null;
  }
};

/**
 * App Lifecycle
 */
export const addAppStateChangeListener = (
  callback: (state: { isActive: boolean }) => void
) => {
  if (!isNative()) return () => {};

  let removeListener: (() => void) | undefined;

  App.addListener('appStateChange', callback).then((listener) => {
    removeListener = () => listener.remove();
  });

  return () => {
    if (removeListener) removeListener();
  };
};

export const addBackButtonListener = (callback: () => void) => {
  if (!isAndroid()) return () => {};

  let removeListener: (() => void) | undefined;

  App.addListener('backButton', callback).then((listener) => {
    removeListener = () => listener.remove();
  });

  return () => {
    if (removeListener) removeListener();
  };
};

/**
 * Initialization
 */
export const initializeCapacitor = async (options?: {
  statusBarStyle?: 'dark' | 'light';
  statusBarColor?: string;
  hideSplashScreen?: boolean;
}): Promise<void> => {
  if (!isNative()) return;

  try {
    if (options?.statusBarStyle) {
      await setStatusBarStyle(options.statusBarStyle === 'dark');
    }

    if (options?.statusBarColor && isAndroid()) {
      await setStatusBarColor(options.statusBarColor);
    }

    if (options?.hideSplashScreen !== false) {
      await hideSplashScreen();
    }
  } catch (error) {
    console.error('Error initializing Capacitor:', error);
  }
};
```

### 6.2 Create React Hooks

Create `src/hooks/use-capacitor.ts`:

```typescript
import { useEffect, useState } from 'react';
import {
  isNative,
  isIOS,
  isAndroid,
  isWeb,
  getPlatform,
  addAppStateChangeListener,
  addBackButtonListener,
  getAppInfo,
} from '@/utils/capacitor';

export const usePlatform = () => {
  const platform = getPlatform();

  return {
    platform,
    isNative: isNative(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isWeb: isWeb(),
  };
};

export const useAppActiveState = () => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isNative()) return;

    const removeListener = addAppStateChangeListener((state) => {
      setIsActive(state.isActive);
    });

    return () => {
      removeListener();
    };
  }, []);

  return isActive;
};

export const useBackButton = (callback: () => void) => {
  useEffect(() => {
    if (!isAndroid()) return;

    const removeListener = addBackButtonListener(callback);

    return () => {
      removeListener();
    };
  }, [callback]);
};

export const useAppInfo = () => {
  const [appInfo, setAppInfo] = useState<{
    name: string;
    id: string;
    version: string;
    build: string;
  } | null>(null);

  useEffect(() => {
    getAppInfo().then(setAppInfo);
  }, []);

  return appInfo;
};

export const useCapacitor = () => {
  const platformInfo = usePlatform();
  const isActive = useAppActiveState();
  const appInfo = useAppInfo();

  return {
    ...platformInfo,
    isActive,
    appInfo,
  };
};
```

### 6.3 Export from Index Files

Update `src/utils/index.ts` (or create if doesn't exist):
```typescript
export * from './capacitor';
```

Update `src/hooks/index.ts` (or create if doesn't exist):
```typescript
export * from './use-capacitor';
```

## Step 7: Add NPM Scripts

### 7.1 Update package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",

    // ADD THESE SCRIPTS ↓
    "build:mobile": "npm run build && npx cap sync",
    "build:apk:debug": "npm run build:mobile && cd android && ./gradlew assembleDebug && cd ..",
    "build:apk:release": "npm run build:mobile && cd android && ./gradlew assembleRelease && cd ..",
    "build:aab": "npm run build:mobile && cd android && ./gradlew bundleRelease && cd ..",
    "cap:sync": "npx cap sync",
    "cap:sync:android": "npx cap sync android",
    "cap:sync:ios": "npx cap sync ios",
    "cap:open:android": "npx cap open android",
    "cap:open:ios": "npx cap open ios",
    "cap:run:android": "npx cap run android",
    "cap:run:ios": "npx cap run ios",
    "cap:update": "npx cap update",
    "cap:doctor": "npx cap doctor"
    // ADD THESE SCRIPTS ↑
  }
}
```

### 7.2 Test Scripts

```bash
# Verify environment
npm run cap:doctor

# Sync assets
npm run cap:sync
```

## Step 8: Update .gitignore

### 8.1 Add Capacitor Ignores

Add to `.gitignore`:

```gitignore
# Capacitor
android/
ios/
*.local.properties
```

**Why**: Native platform folders are generated and should not be committed. They can be regenerated with `npx cap add android/ios`.

### 8.2 Verify Git Status

```bash
git status
```

Should NOT show `android/` or `ios/` folders.

## Step 9: Build and Test

### 9.1 Build Web Assets

```bash
npm run build
```

Verify `dist/` folder exists and has content.

### 9.2 Sync to Platforms

```bash
npm run cap:sync
```

Should see:
```
✔ Copying web assets from dist to android/...
✔ Copying web assets from dist to ios/...
✔ Updating Android plugins
✔ Updating iOS plugins
✔ Sync finished
```

### 9.3 Build Android APK

```bash
npm run build:apk:debug
```

**Expected output**:
```
BUILD SUCCESSFUL in XXs
```

**APK location**: `android/app/build/outputs/apk/debug/app-debug.apk`

### 9.4 Verify APK

```bash
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

Should show file size (typically 3-10 MB).

### 9.5 Install on Device (Optional)

If you have an Android device connected:

```bash
adb devices  # Verify device connected
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Usage Examples

### Initialize Capacitor in Your App

In your main `App.tsx` or `main.tsx`:

```typescript
import { useEffect } from 'react';
import { initializeCapacitor } from '@/utils/capacitor';

function App() {
  useEffect(() => {
    initializeCapacitor({
      statusBarStyle: 'dark',
      statusBarColor: '#000000',
      hideSplashScreen: true,
    });
  }, []);

  return <div>Your App</div>;
}
```

### Platform Detection

```typescript
import { usePlatform } from '@/hooks/use-capacitor';

function MyComponent() {
  const { platform, isNative, isAndroid, isIOS } = usePlatform();

  return (
    <div>
      <p>Platform: {platform}</p>
      {isNative && <p>Running in native app</p>}
      {isAndroid && <button>Android specific feature</button>}
      {isIOS && <button>iOS specific feature</button>}
    </div>
  );
}
```

### Handle Back Button (Android)

```typescript
import { useBackButton } from '@/hooks/use-capacitor';
import { useNavigate } from 'react-router';

function MyComponent() {
  const navigate = useNavigate();

  useBackButton(() => {
    // Handle Android back button
    navigate(-1);
  });

  return <div>Content</div>;
}
```

## Troubleshooting

### Build Fails: "invalid source release: 21"

**Problem**: Wrong Java version

**Solution**:
```bash
java -version  # Should show Java 21

# If wrong version, install Java 21:
sudo apt install openjdk-21-jdk

# Update gradle.properties
echo "org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64" >> android/gradle.properties
```

### Build Fails: "SDK location not found"

**Problem**: Missing `local.properties`

**Solution**:
```bash
echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
```

### Assets Not Loading in Native App

**Problem**: Wrong base path in Vite

**Solution**: Ensure `vite.config.ts` has `base: './'`

### Duplicate Resources Error

**Problem**: Compressed files (.gz, .br) treated as duplicates

**Solution**: Update `android/app/build.gradle`:
```gradle
ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~:!*.gz:!*.br'
```

### iOS Build Fails on Linux

**Problem**: iOS requires macOS

**Solution**:
- Use macOS for iOS builds
- Or set up GitHub Actions with macOS runner
- Or use cloud build service (Ionic Appflow, Codemagic)

## Next Steps

1. **Read Documentation**:
   - [CAPACITOR_GUIDE.md](./CAPACITOR_GUIDE.md) - Usage guide
   - [BUILD_ANDROID_APK.md](./BUILD_ANDROID_APK.md) - Android builds
   - [MOBILE_DEVELOPMENT.md](./MOBILE_DEVELOPMENT.md) - Development workflow

2. **Test on Device**: Install APK on Android device

3. **Add More Plugins**: Explore [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

4. **Configure Signing**: Set up release signing for Play Store

5. **iOS Setup** (if on macOS): Build iOS app in Xcode

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor 7 Migration](https://capacitorjs.com/docs/updating/7-0)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Environment Setup](https://capacitorjs.com/docs/getting-started/environment-setup)

---

**Implementation Time**: 30-60 minutes
**Difficulty**: Intermediate
**Prerequisites**: React, TypeScript, Vite knowledge
