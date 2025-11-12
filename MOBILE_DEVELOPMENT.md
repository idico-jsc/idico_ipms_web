# Mobile Development Workflow

Complete guide for developing and testing the Parent Portal mobile application.

## Table of Contents

- [Overview](#overview)
- [Development Setup](#development-setup)
- [Daily Development Workflow](#daily-development-workflow)
- [Testing Strategies](#testing-strategies)
- [Debugging](#debugging)
- [Best Practices](#best-practices)
- [Common Tasks](#common-tasks)
- [Performance Optimization](#performance-optimization)

## Overview

This guide covers the complete mobile development workflow, from setup to deployment, with best practices for efficient development.

### Development Principles

1. **Web-first development** - Develop in browser, test on mobile
2. **Progressive enhancement** - Web works, native features enhance
3. **Platform detection** - Gracefully handle web vs native differences
4. **Hot reload** - Fast iteration in development

## Development Setup

### Initial Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Verify environment**:
   ```bash
   npm run cap:doctor
   ```

3. **Build web assets**:
   ```bash
   npm run build
   ```

4. **Sync to platforms**:
   ```bash
   npm run cap:sync
   ```

### IDE Setup

#### VS Code (Recommended)

**Extensions**:
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense

**Settings** (.vscode/settings.json):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### Android Studio

**For native Android debugging**:
1. Open project: `npm run cap:open:android`
2. Wait for Gradle sync
3. Enable "Auto-Import" for dependencies

## Daily Development Workflow

### Recommended Workflow

```
┌─────────────────────────────────────────┐
│ 1. Web Development (Fastest)           │
│    npm run dev                          │
│    Test in browser with DevTools        │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ 2. Build & Sync (When ready)           │
│    npm run build:mobile                 │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ 3. Test on Device/Emulator              │
│    npm run cap:run:android              │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│ 4. Debug & Iterate                      │
│    Use Android Studio Logcat            │
│    Fix issues, repeat from step 1       │
└─────────────────────────────────────────┘
```

### Step-by-Step

#### 1. Start Development Server

```bash
npm run dev
```

- Opens at http://localhost:5173
- Hot reload enabled
- Fastest iteration cycle

#### 2. Develop in Browser

- Use Chrome DevTools mobile simulation (Ctrl+Shift+M)
- Test responsive design
- Debug JavaScript
- Inspect network requests

**Simulate mobile**:
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device (iPhone, Pixel, etc.)
4. Rotate screen (Ctrl+Shift+R)

#### 3. Test Platform-Specific Code

Use platform detection:
```typescript
import { isNative, isWeb } from '@/utils/capacitor';

// Test in browser (isWeb returns true)
if (isWeb()) {
  console.log('Testing web version');
}

// Will execute when running in native app
if (isNative()) {
  console.log('Testing native version');
}
```

#### 4. Build for Mobile

```bash
# Build and sync
npm run build:mobile

# Or step by step:
npm run build              # Build web assets
npm run cap:sync          # Sync to all platforms
```

#### 5. Run on Device/Emulator

**Option A: Quick run** (launches app automatically):
```bash
npm run cap:run:android
```

**Option B: Manual run**:
```bash
npm run cap:open:android   # Opens Android Studio
# Then click Run (green play button)
```

**Option C: Install APK**:
```bash
npm run build:apk:debug
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### When to Sync

**✅ Sync required when**:
- Web assets changed (after `npm run build`)
- Capacitor config changed
- First time setup
- New plugins installed

**❌ Sync NOT required when**:
- Using `npm run dev` (changes auto-reload in browser)
- Only TypeScript/JavaScript changes in development
- CSS/styling changes in development

**How to sync**:
```bash
# All platforms
npm run cap:sync

# Android only (faster)
npm run cap:sync:android
```

## Testing Strategies

### Testing Pyramid

```
        ╱╲
       ╱  ╲          E2E Tests (Cypress)
      ╱    ╲         - Full user flows
     ╱──────╲        - Native + Web
    ╱        ╲
   ╱          ╲      Component Tests
  ╱            ╲     - React components
 ╱──────────────╲    - Hooks and utilities
╱                ╲
──────────────────   Unit Tests
                     - Pure functions
                     - Business logic
```

### 1. Browser Testing (Development)

**When**: During active development

**How**:
```bash
npm run dev
# Open http://localhost:5173
# Use Chrome DevTools mobile simulation
```

**Test**:
- UI/UX
- Responsive design
- Basic functionality
- Network requests

### 2. Android Emulator Testing

**When**: Before committing, weekly

**Setup emulator**:
1. Open Android Studio
2. Tools → Device Manager
3. Create Virtual Device
4. Choose Pixel 5 or similar
5. Download system image (API 33+)

**Run tests**:
```bash
# Start emulator from Android Studio
# Then:
npm run cap:run:android
```

**Test**:
- Native features (StatusBar, SplashScreen)
- App lifecycle (background/foreground)
- Device-specific issues
- Performance

### 3. Physical Device Testing

**When**: Before release, major features

**Setup**:
1. Enable Developer Options on device
2. Enable USB Debugging
3. Connect via USB
4. Verify: `adb devices`

**Run tests**:
```bash
npm run build:apk:debug
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Test**:
- Real-world performance
- Touch interactions
- Device sensors
- Camera/GPS (if used)
- Battery impact

### 4. E2E Testing with Cypress

**Setup**:
```bash
npm run dev          # Terminal 1
npm run e2e          # Terminal 2
```

**Write tests** (cypress/e2e/):
```typescript
describe('Mobile App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.viewport('iphone-x');
  });

  it('should load home page', () => {
    cy.get('h1').should('be.visible');
  });

  it('should navigate', () => {
    cy.get('[data-testid="menu"]').click();
    cy.url().should('include', '/menu');
  });
});
```

**Run tests**:
```bash
npm run e2e:headless    # CI/CD
npm run e2e             # Interactive
```

## Debugging

### Browser DevTools

**Console logs**:
```typescript
console.log('Debug info:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

**Network tab**:
- Monitor API requests
- Check request/response
- Simulate slow network

**React DevTools**:
- Install browser extension
- Inspect component props/state
- Profile performance

### Android Debugging

#### Logcat (Android Studio)

1. Connect device or start emulator
2. Open Android Studio
3. View → Tool Windows → Logcat

**Filter logs**:
```
package:com.wellspring.parentportal
```

**Log levels**:
- Verbose (V) - All logs
- Debug (D) - Debug logs
- Info (I) - Info logs
- Warn (W) - Warnings
- Error (E) - Errors only

#### Chrome Remote Debugging

1. **Enable** USB Debugging on device
2. **Connect** device via USB
3. **Open** Chrome on desktop
4. **Navigate** to chrome://inspect
5. **Click** "inspect" under your app

**Features**:
- Full DevTools
- Console access
- Network inspection
- DOM inspection
- JavaScript debugging

#### Command Line Debugging

```bash
# View logs
adb logcat

# Filter by tag
adb logcat -s Capacitor

# Clear logs
adb logcat -c

# Save logs to file
adb logcat > logs.txt
```

### Common Debug Patterns

```typescript
// Log platform info
console.log('Platform:', getPlatform());
console.log('Is Native:', isNative());

// Log app info
getAppInfo().then(info => {
  console.log('App Info:', info);
});

// Log lifecycle events
addAppStateChangeListener(state => {
  console.log('App state changed:', state.isActive ? 'active' : 'background');
});

// Try-catch for native features
try {
  await setStatusBarStyle(true);
} catch (error) {
  console.error('Status bar error:', error);
}
```

## Best Practices

### Code Organization

```typescript
// ✅ Good: Platform detection in utilities
import { isNative } from '@/utils/capacitor';

function MyComponent() {
  useEffect(() => {
    if (isNative()) {
      // Native-specific code
    }
  }, []);
}

// ❌ Bad: Hardcoded platform checks
function MyComponent() {
  useEffect(() => {
    if (window.Capacitor) { // Don't do this
      // ...
    }
  }, []);
}
```

### Progressive Enhancement

```typescript
// ✅ Good: Works on web, enhanced on native
function MyComponent() {
  const { isNative } = usePlatform();

  return (
    <div>
      <h1>Works on all platforms</h1>
      {isNative && (
        <button onClick={() => exitApp()}>
          Exit App
        </button>
      )}
    </div>
  );
}
```

### Error Handling

```typescript
// ✅ Good: Graceful error handling
async function initApp() {
  try {
    await initializeCapacitor({
      statusBarStyle: 'dark',
      hideSplashScreen: true,
    });
  } catch (error) {
    console.error('Capacitor init failed:', error);
    // App still works, just without native features
  }
}

// ❌ Bad: Crashes on error
async function initApp() {
  await initializeCapacitor(); // May crash if fails
}
```

### Performance

```typescript
// ✅ Good: Lazy load native features
const SplashScreen = isNative()
  ? lazy(() => import('@/components/NativeSplash'))
  : lazy(() => import('@/components/WebSplash'));

// ✅ Good: Memoize platform detection
const platform = useMemo(() => getPlatform(), []);

// ❌ Bad: Call on every render
function MyComponent() {
  const platform = getPlatform(); // Called every render
  // ...
}
```

### TypeScript

```typescript
// ✅ Good: Type platform checks
type Platform = 'ios' | 'android' | 'web';

function platformSpecificLogic(platform: Platform) {
  switch (platform) {
    case 'ios':
      // iOS logic
      break;
    case 'android':
      // Android logic
      break;
    case 'web':
      // Web logic
      break;
  }
}

// Use with type safety
platformSpecificLogic(getPlatform());
```

## Common Tasks

### Adding New Native Feature

1. **Install plugin**:
   ```bash
   npm install @capacitor/camera
   ```

2. **Update Capacitor**:
   ```bash
   npm run cap:sync
   ```

3. **Add permissions** (android/app/src/main/AndroidManifest.xml):
   ```xml
   <uses-permission android:name="android.permission.CAMERA" />
   ```

4. **Create utility** (src/utils/camera.ts):
   ```typescript
   import { Camera } from '@capacitor/camera';

   export async function takePicture() {
     const image = await Camera.getPhoto({
       quality: 90,
       allowEditing: false,
       resultType: 'uri'
     });
     return image.webPath;
   }
   ```

5. **Use in component**:
   ```typescript
   import { takePicture } from '@/utils/camera';

   function MyComponent() {
     const handlePhoto = async () => {
       const photo = await takePicture();
       console.log('Photo:', photo);
     };

     return <button onClick={handlePhoto}>Take Photo</button>;
   }
   ```

### Updating Capacitor

```bash
# Check for updates
npm outdated @capacitor/*

# Update all Capacitor packages
npm run cap:update

# Sync changes
npm run cap:sync
```

### Changing App Icon/Splash

1. **Prepare assets**:
   - Icon: 1024x1024 PNG
   - Splash: 2732x2732 PNG

2. **Use asset generator**:
   - [Capacitor Assets](https://github.com/ionic-team/capacitor-assets)
   - Or Android Studio Asset Studio

3. **Replace files**:
   - Android: `android/app/src/main/res/`
   - iOS: `ios/App/App/Assets.xcassets/`

4. **Sync**:
   ```bash
   npm run cap:sync
   ```

### Clean Build

```bash
# Clean web build
rm -rf dist/

# Clean Android build
cd android
./gradlew clean
cd ..

# Clean node_modules (nuclear option)
rm -rf node_modules/
npm install
```

## Performance Optimization

### Build Size

```bash
# Analyze bundle
npm run build
# Check dist/ size

# Optimize images (handled by unplugin-imagemin)
# Minify code (handled by Vite + Terser)
```

### Runtime Performance

**Lazy loading**:
```typescript
const HomePage = lazy(() => import('@/app/home/page'));
```

**Memoization**:
```typescript
const expensiveValue = useMemo(() => computeExpensive(data), [data]);
```

**Debouncing**:
```typescript
const debouncedSearch = useMemo(
  () => debounce((query) => search(query), 300),
  []
);
```

### Native Performance

**Optimize splash screen**:
```typescript
// Hide splash as soon as possible
useEffect(() => {
  hideSplashScreen();
}, []);
```

**Reduce re-renders**:
```typescript
// Use React.memo for platform checks
const PlatformSpecific = memo(({ children }) => {
  const { isNative } = usePlatform();
  return isNative ? children : null;
});
```

## Next Steps

1. Read [CAPACITOR_GUIDE.md](./CAPACITOR_GUIDE.md) for Capacitor API reference
2. Read [BUILD_ANDROID_APK.md](./BUILD_ANDROID_APK.md) for build instructions
3. Set up CI/CD for automated builds
4. Configure signing for release builds
5. Plan Play Store submission
