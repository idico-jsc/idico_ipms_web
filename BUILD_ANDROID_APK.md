# Building Android APK

Complete guide for building Android APK and AAB files for the Parent Portal application.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Build Types](#build-types)
- [Quick Start](#quick-start)
- [Step-by-Step Guide](#step-by-step-guide)
- [Signing Configuration](#signing-configuration)
- [Testing the APK](#testing-the-apk)
- [Troubleshooting](#troubleshooting)

## Overview

This guide covers building Android application packages:
- **APK (Android Package)** - For direct installation and testing
- **AAB (Android App Bundle)** - For Google Play Store distribution

### Build Outputs

After building, you'll find the files at:
```
android/app/build/outputs/
├── apk/
│   ├── debug/
│   │   └── app-debug.apk          # Debug APK (~5-10 MB)
│   └── release/
│       └── app-release.apk        # Release APK (unsigned)
└── bundle/
    └── release/
        └── app-release.aab        # Release AAB for Play Store
```

## Prerequisites

### Required Software

1. **Java 21** (Capacitor 7 requirement)
   ```bash
   java -version
   # Should output: openjdk version "21.x.x"
   ```

2. **Android SDK** (API 23+)
   ```bash
   # Verify SDK path
   ls ~/Android/Sdk
   ```

3. **Gradle 8.7+** (included with project)
   ```bash
   cd android && ./gradlew --version
   ```

### Environment Verification

```bash
# Check all dependencies
npm run cap:doctor

# Expected output:
# ✅ @capacitor/cli: 7.4.3
# ✅ @capacitor/android: 7.4.3
# ✅ Android looking great! 👌
```

## Build Types

### Debug APK

**Purpose**: Development and testing
- Not optimized
- Not signed for release
- Console logs enabled
- Larger file size
- Can install directly on devices

**Use for**:
- Testing on physical devices
- QA testing
- Internal distribution
- Development builds

### Release APK

**Purpose**: Production distribution (non-Play Store)
- Optimized and minified
- Requires signing for installation
- Console logs removed (configured in vite.config.ts)
- Smaller file size
- For direct download/sideloading

**Use for**:
- Production app (outside Play Store)
- Enterprise distribution
- Beta testing platforms
- Direct downloads

### Android App Bundle (AAB)

**Purpose**: Google Play Store distribution
- Optimized for Play Store
- Google generates optimized APKs for each device
- Smaller downloads for users
- Required by Play Store (since August 2021)

**Use for**:
- Publishing to Google Play Store only

## Quick Start

### Build Debug APK (Fastest)

```bash
# One command build
npm run build:apk:debug

# Find APK at:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Build Release APK

```bash
# One command build (requires signing setup)
npm run build:apk:release

# Find APK at:
# android/app/build/outputs/apk/release/app-release.apk
```

### Build AAB for Play Store

```bash
# One command build (requires signing setup)
npm run build:aab

# Find AAB at:
# android/app/build/outputs/bundle/release/app-release.aab
```

## Step-by-Step Guide

### Building Debug APK

#### Step 1: Build Web Assets

```bash
npm run build
```

This creates the web assets in `dist/` directory.

#### Step 2: Sync to Android

```bash
npm run cap:sync:android
```

This copies web assets to `android/app/src/main/assets/public/`.

#### Step 3: Build Debug APK

```bash
cd android
./gradlew assembleDebug
cd ..
```

Or use the combined script:
```bash
npm run build:apk:debug
```

#### Step 4: Locate the APK

```bash
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

### Building Release APK

#### Step 1: Create Keystore (First Time Only)

Generate a signing key:
```bash
keytool -genkey -v -keystore parent-portal-release.keystore \
  -alias parent-portal \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Important**: Save the keystore file and passwords securely!

#### Step 2: Configure Signing

Create `android/keystore.properties`:
```properties
storeFile=/path/to/parent-portal-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=parent-portal
keyPassword=YOUR_KEY_PASSWORD
```

**Security**: Add to .gitignore:
```bash
echo "android/keystore.properties" >> .gitignore
```

#### Step 3: Update build.gradle

Edit `android/app/build.gradle`, add before `android {`:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... existing config ...

    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### Step 4: Build Release APK

```bash
npm run build:apk:release
```

#### Step 5: Locate the APK

```bash
ls -lh android/app/build/outputs/apk/release/app-release.apk
```

### Building AAB for Play Store

#### Prerequisites
- Signing configured (see Release APK steps above)
- Google Play Developer account

#### Build AAB

```bash
npm run build:aab
```

#### Locate the AAB

```bash
ls -lh android/app/build/outputs/bundle/release/app-release.aab
```

#### Upload to Play Store

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (or create new)
3. Navigate to "Release" → "Production" (or "Testing")
4. Click "Create new release"
5. Upload `app-release.aab`
6. Fill in release details
7. Review and publish

## Signing Configuration

### Why Signing is Required

- Android requires all apps to be digitally signed
- Debug builds use a default debug keystore
- Release builds need your own keystore
- Same keystore must be used for all updates

### Keystore Best Practices

1. **Backup your keystore**:
   - Store in multiple secure locations
   - Without it, you can't update your app

2. **Never commit to git**:
   ```bash
   # Add to .gitignore
   *.keystore
   android/keystore.properties
   ```

3. **Use strong passwords**:
   - Minimum 8 characters
   - Mix of letters, numbers, symbols

4. **Document the details**:
   - Store passwords in secure password manager
   - Note the keystore location
   - Record the alias name

### Keystore Information

Store this information securely:
```
Keystore file: parent-portal-release.keystore
Alias: parent-portal
Store Password: [STORE_IN_PASSWORD_MANAGER]
Key Password: [STORE_IN_PASSWORD_MANAGER]
Validity: 10000 days (~27 years)
```

## Testing the APK

### Install on Device via USB

1. **Enable USB Debugging** on your Android device:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect device** via USB

3. **Verify connection**:
   ```bash
   adb devices
   # Should show your device
   ```

4. **Install APK**:
   ```bash
   # Debug APK
   adb install android/app/build/outputs/apk/debug/app-debug.apk

   # Release APK
   adb install android/app/build/outputs/apk/release/app-release.apk
   ```

5. **Uninstall** (if needed):
   ```bash
   adb uninstall com.wellspring.parentportal
   ```

### Install via Android Emulator

1. **Start emulator** from Android Studio

2. **Verify emulator**:
   ```bash
   adb devices
   # Should show emulator-xxxx
   ```

3. **Install APK**:
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Install via File Share

1. **Copy APK** to your phone (email, cloud storage, etc.)

2. **Open APK** on phone

3. **Allow installation** from unknown sources (if prompted)

4. **Install** the app

## Troubleshooting

### Build Fails with "invalid source release: 21"

**Cause**: Wrong Java version

**Solution**:
```bash
# Check Java version
java -version

# Should show Java 21, if not:
sudo apt install openjdk-21-jdk

# Verify gradle.properties
cat android/gradle.properties | grep java.home
# Should show: org.gradle.java.home=/usr/lib/jvm/java-21-openjdk-amd64
```

### Build Fails with "SDK location not found"

**Cause**: Missing local.properties

**Solution**:
```bash
# Create android/local.properties
echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
```

### APK Won't Install on Device

**Cause**: Signature mismatch or not signed

**Solution**:
1. Uninstall existing app: `adb uninstall com.wellspring.parentportal`
2. Rebuild with signing configured
3. Try installing again

### "App Not Installed" Error

**Possible causes**:
1. **Insufficient storage**: Free up space on device
2. **Package conflict**: Uninstall old version first
3. **Corrupted APK**: Rebuild the APK
4. **Wrong architecture**: Rebuild with correct architecture support

### Blank Screen in APK

**Cause**: Assets not loading (wrong base path)

**Solution**: Verify vite.config.ts has `base: './'`:
```typescript
export default defineConfig({
  base: './', // Required for Capacitor
  // ...
});
```

Then rebuild:
```bash
npm run build:apk:debug
```

### Build is Slow

**Optimization tips**:
1. **Use build cache**: Don't clean unless necessary
2. **Incremental builds**: Only rebuild changed parts
3. **Use debug builds** for testing (faster than release)
4. **Close Android Studio** when building from CLI

### Check APK Size

```bash
# List APK with size
ls -lh android/app/build/outputs/apk/debug/app-debug.apk

# Analyze APK contents
cd android
./gradlew app:assembleDebug --scan
```

## Build Optimization

### Reduce APK Size

1. **Enable ProGuard** (code shrinking):
   Edit `android/app/build.gradle`:
   ```gradle
   buildTypes {
       release {
           minifyEnabled true  // Change to true
           shrinkResources true
           proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
       }
   }
   ```

2. **Remove unused resources**: Already handled by Vite build

3. **Use WebP images**: Convert PNG/JPG to WebP

4. **Analyze bundle**:
   ```bash
   cd android
   ./gradlew app:bundleRelease --scan
   ```

### Speed Up Builds

1. **Increase Gradle memory**:
   Edit `android/gradle.properties`:
   ```properties
   org.gradle.jvmargs=-Xmx4096m
   ```

2. **Enable parallel builds**:
   ```properties
   org.gradle.parallel=true
   ```

3. **Use daemon**:
   ```properties
   org.gradle.daemon=true
   ```

## Next Steps

1. Read [CAPACITOR_GUIDE.md](./CAPACITOR_GUIDE.md) for Capacitor usage
2. Read [MOBILE_DEVELOPMENT.md](./MOBILE_DEVELOPMENT.md) for development workflow
3. Configure signing for release builds
4. Test on physical devices
5. Prepare for Play Store submission
