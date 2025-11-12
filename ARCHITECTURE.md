# Project Architecture

This project follows a feature-based architecture with atomic design principles, internationalization, and mobile-first approach using Capacitor.

## Folder Structure

```
src/
├── app/                 # Next.js-style App Router
│   ├── layout.tsx      # Root layout (wraps all routes)
│   ├── page.tsx        # Home page (/)
│   ├── routes.tsx      # Router system (auto-generated)
│   ├── not-found.tsx   # 404 page (catch-all)
│   ├── error.tsx       # Root error boundary
│   ├── about/
│   │   └── page.tsx    # /about
│   ├── contact/
│   │   └── page.tsx    # /contact
│   └── (auth)/         # Route group (not in URL)
│       ├── layout.tsx  # Auth layout
│       └── login/
│           └── page.tsx # /login
│
├── components/          # Atomic Design Components
│   ├── atoms/          # Basic UI elements (Button, Input, etc.)
│   ├── molecules/      # Simple component combinations
│   ├── organisms/      # Complex UI components
│   ├── templates/      # Page-level layouts
│   ├── pages/          # Page-specific components
│   └── index.ts       # Public exports
│
├── features/           # Feature Modules (Business Logic)
│   ├── auth/          # Authentication feature
│   ├── dashboard/     # Dashboard feature
│   └── profile/       # Profile feature
│
├── hooks/             # Shared custom hooks
│   ├── use-capacitor.ts    # Capacitor/mobile hooks
│   ├── use-dark-mode.ts    # Dark mode toggle
│   ├── use-language.ts     # i18n language switching
│
├── utils/             # Utility functions
│   ├── capacitor.ts   # Capacitor platform utilities
│   ├── cn.ts          # Tailwind class merger
│   └── index.ts      # Public exports
│
├── providers/         # React Context Providers
│   ├── theme-provider.tsx  # Dark mode provider
│   └── i18n-provider.tsx   # i18n provider
│
├── locales/          # Internationalization
│   ├── en/
│   │   ├── common.json
│   │   └── home.json
│   └── vi/
│       ├── common.json
│       └── home.json
│
├── lib/              # Third-party library configurations
│   ├── i18n.ts       # i18next configuration
│   └── utils.ts      # Shared utilities
│
├── constants/        # Global constants
│   ├── languages.ts  # Supported languages
│   ├── version.ts    # App version
│   └── index.ts     # Public exports
│
├── types/            # Global TypeScript types
│   ├── i18n.d.ts     # i18next type definitions
│   └── index.ts     # Public exports
│
├── store/            # Global state management
│   └── index.ts     # State exports
│
├── data/             # Static data and mock data
│   └── index.ts     # Public exports
│
└── main.tsx          # Application entry point
```

## Native Platform Structure

```
build/
├── android/                     # Android native project (gitignored)
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/public/  # Web assets (synced from build/web/)
│   │   │   ├── AndroidManifest.xml
│   │   │   └── java/...        # Native Android code
│   │   └── build.gradle        # App-level build config (Java 21)
│   ├── build.gradle            # Project-level build config
│   ├── gradle.properties       # Gradle settings (Java 21)
│   └── local.properties        # SDK path (not committed)
│
└── ios/                         # iOS native project (gitignored)
    ├── App/
    │   ├── App/
    │   │   ├── public/          # Web assets (synced from build/web/)
    │   │   ├── Info.plist       # iOS app configuration
    │   │   └── AppDelegate.swift # iOS app entry point
    │   ├── App.xcodeproj/       # Xcode project
    │   ├── App.xcworkspace/     # Xcode workspace
    │   └── Podfile              # CocoaPods dependencies
    └── Pods/                    # CocoaPods packages (generated)
```

## Configuration Files

```
Root/
├── capacitor.config.ts         # Capacitor configuration
├── vite.config.ts             # Vite build configuration (base: './')
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
├── .gitignore                 # Git ignore (includes android/, ios/)
└── index.html                 # HTML entry point
```

## Architecture Principles

### 1. Atomic Design (Components)

Components are organized by complexity:

- **Atoms**: Basic building blocks (Button, Input, Label)
- **Molecules**: Simple combinations (SearchBox, FormField)
- **Organisms**: Complex components (Navbar, Card, Modal)
- **Templates**: Page layouts (DashboardLayout, AuthLayout)
- **Pages**: Page-specific components that don't fit routing

### 2. Feature-Based Structure

Each feature is self-contained with:

```
feature-name/
├── components/     # Feature-specific UI components
├── hooks/         # Feature-specific hooks
├── services/      # API calls and business logic
├── types/         # TypeScript types
├── utils/         # Helper functions
└── index.ts      # Public API
```

### 3. Next.js-Style App Router (app/ folder)

Full Next.js App Router conventions with automatic route discovery:

```
app/
├── layout.tsx              # Root layout (wraps all routes)
├── page.tsx                # Home → /
├── routes.tsx              # Router system (auto-generated)
├── not-found.tsx           # 404 page → /*
├── error.tsx               # Root error boundary
│
├── about/
│   └── page.tsx            # /about
├── contact/
│   └── page.tsx            # /contact
│
└── (auth)/                 # Route group (not in URL)
    ├── layout.tsx          # Auth layout (wraps all auth routes)
    ├── login/
    │   └── page.tsx        # /login (not /auth/login)
    └── register/
        └── page.tsx        # /register
```

**File Conventions**:
- `page.tsx` - Makes route publicly accessible
- `layout.tsx` - Shared UI wrapper (cascades automatically)
- `error.tsx` - Error boundary for route segment
- `not-found.tsx` - 404 fallback page
- `(folder)` - Route groups (organization, not in URL)
- `_folder` - Private folders (excluded from routing)

**Benefits**:
- ✅ File-system = URL structure (no manual registration)
- ✅ Automatic layout cascading (root → nested)
- ✅ Route groups for organization without URL impact
- ✅ Convention over configuration
- ✅ Industry-standard (Next.js compatible)
- ✅ Type-safe with TypeScript
- ✅ Auto-discovery with Vite glob imports

### 4. Mobile-First Architecture (Capacitor)

**Platform Detection**:
```typescript
import { isNative, isIOS, isAndroid, isWeb } from '@/utils/capacitor';
```

**Utilities**:
- Platform detection (web vs native)
- Status bar control
- Splash screen management
- App lifecycle hooks
- Native device features

**Hooks**:
- `usePlatform()` - Detect platform
- `useAppState()` - App active/background state
- `useBackButton()` - Android back button
- `useAppInfo()` - App version and info

### 5. Internationalization (i18n)

**Supported Languages**: English (en), Vietnamese (vi)

**Structure**:
```
locales/
├── en/
│   ├── common.json    # Shared translations
│   └── home.json      # Page-specific translations
└── vi/
    ├── common.json
    └── home.json
```

**Usage**:
```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('home');
const title = t('welcome');
```

**Features**:
- Automatic language detection
- Persistent language selection
- Namespace-based translations
- Type-safe translations

### 6. Progressive Web App (PWA)

**Features**:
- Service Worker for offline support
- Web App Manifest
- Install prompt
- Push notifications ready
- Optimized caching strategy

**Assets**:
- PWA icons (192x192, 512x512)
- Favicon
- Splash screens
- Optimized for mobile

### 7. Dark Mode Support

**Implementation**:
- `useTheme()` hook
- `ThemeProvider` context
- Persistent theme selection
- Tailwind dark mode classes
- System preference detection

### 8. Import Rules

✅ **Allowed:**
- Features can import from `@/components` (atomic design)
- Features can import from global `@/hooks`, `@/utils`, `@/lib`
- Pages can import from `@/features`
- Pages can import from `@/components`
- Use `@/` alias for absolute imports

❌ **Not Allowed:**
- Features importing from other features
- Direct cross-feature dependencies
- Circular dependencies

### 9. Component Usage Flow

```
Page (app/*/page.tsx)
  ↓ (uses)
Feature Components
  ↓ (uses)
Atomic Components (atoms/molecules/organisms)
  ↓ (uses)
Utility Functions & Hooks
```

### 10. Build & Deploy Flow

**Development**:
```bash
npm run dev          # Web development (localhost:5173)
```

**Web Build**:
```bash
npm run build        # Builds to build/web/
npm run preview      # Preview production build
```

**Mobile Build**:
```bash
npm run build:mobile      # Build web + sync to mobile
npm run build:apk:debug   # Build Android debug APK
npm run cap:run:android   # Run on Android device
```

**Platform Sync**:
```bash
npm run cap:sync          # Sync web assets to all platforms
npm run cap:sync:android  # Sync to Android only
npm run cap:sync:ios      # Sync to iOS only
```

## Example Usage

### Importing Components

```tsx
// Atomic components
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/organisms/card';

// Features
import { LoginForm, useAuth } from '@/features/auth/index';
import { DashboardStats } from '@/features/dashboard/index';
```

### Using Platform Detection

```tsx
import { usePlatform } from '@/hooks/use-capacitor';

function MyComponent() {
  const { platform, isNative, isAndroid, isIOS } = usePlatform();

  return (
    <div>
      <p>Platform: {platform}</p>
      {isNative && <p>Running in native app</p>}
      {isAndroid && <button>Android feature</button>}
      {isIOS && <button>iOS feature</button>}
    </div>
  );
}
```

### Using Internationalization

```tsx
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/use-language';

function MyComponent() {
  const { t } = useTranslation('home');
  const { language, changeLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => changeLanguage('vi')}>
        Tiếng Việt
      </button>
    </div>
  );
}
```

### Using Dark Mode

```tsx
import { useTheme } from '@/hooks/use-dark-mode';

function MyComponent() {
  const { isDark, toggleDarkMode } = useTheme();

  return (
    <div className={isDark ? 'dark' : ''}>
      <button onClick={toggleDarkMode}>
        Toggle {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
```

### Creating a New Page

```tsx
// app/about/page.tsx
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation('about');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

**That's it!** The route is automatically discovered and accessible at `/about`.

No manual route registration required. The file-based routing system automatically:
1. Discovers the `page.tsx` file
2. Generates the route from folder structure
3. Applies root layout automatically

## File Naming Conventions

- **Components**: `PascalCase.tsx` (Button.tsx, UserProfile.tsx)
- **Hooks**: `use-hook-name.ts` (use-dark-mode.ts, use-capacitor.ts)
- **Utils**: `kebab-case.ts` (capacitor.ts, cn.ts)
- **Types**: `kebab-case.types.ts` or `i18n.d.ts`
- **Index files**: `index.ts` (public exports, underscore prefix)
- **Pages**: `page.tsx` (app/home/page.tsx)
- **Layouts**: `layout.tsx` (app/layout.tsx)

## TypeScript Configuration

**Path Aliases**:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Usage**:
```typescript
import { Button } from '@/components/atoms/button';
import { usePlatform } from '@/hooks/use-capacitor';
import { API_URL } from '@/constants/api';
```

## Best Practices

### General

1. **Keep features independent**: Avoid tight coupling between features
2. **Use atomic components**: Don't recreate basic UI elements
3. **Centralize shared logic**: Put reusable code in global folders
4. **Type everything**: Use TypeScript for better DX
5. **Document features**: Add README.md in each feature folder
6. **Use absolute imports**: Prefer `@/` over relative paths

### Mobile Development

7. **Platform detection first**: Always check platform before using native features
8. **Graceful degradation**: Web features should work without native APIs
9. **Test on real devices**: Emulators don't catch all issues
10. **Handle permissions**: Request permissions before using device features

### Internationalization

11. **Namespace translations**: Separate by page/feature
12. **Use translation keys**: Never hardcode strings
13. **Support RTL**: Design with RTL languages in mind
14. **Fallback language**: Always provide English fallback

### Performance

15. **Lazy load routes**: Use dynamic imports for pages
16. **Optimize images**: Use WebP format
17. **Code splitting**: Separate vendor bundles
18. **PWA caching**: Cache static assets aggressively

## State Management

The project uses a hybrid approach:

### Local State
- `useState` for component-level state
- `useContext` for shared state (theme, i18n)
- Custom hooks for business logic

### Global State
- **Zustand** for authentication state (user, isAuthenticated, etc.)
- User data stored in memory only (NOT persisted to localStorage)
- Token storage handled separately via cookies + localStorage

### Data Fetching
- **SWR** for server state, data fetching, and caching
- Used for API calls with automatic revalidation
- Configured globally in `src/providers/swr-provider.tsx`

### Authentication State
See **[AUTH_GUIDE.md](AUTH_GUIDE.md)** for complete authentication documentation.

## API Integration

### Frappe Backend Integration

The project includes built-in support for Frappe Framework backend using bearer token authentication.

**Provider Configuration**:
```tsx
// providers/providers.tsx
<I18nProvider>
  <SWRProvider>
    <FrappeProvider>{children}</FrappeProvider>
  </SWRProvider>
</I18nProvider>
```

**Environment Configuration**:
```env
# .env.development or .env.production
VITE_FRAPPE_URL=https://your-frappe-server.frappe.cloud
VITE_FRAPPE_USE_TOKEN=true
```

**Authentication**:

The project includes a complete authentication system with:
- Bearer token authentication (JWT)
- Zustand global state management
- Hybrid token storage (cookies + localStorage)
- Automatic token injection in API requests
- Auto-initialization on page load

```typescript
import { useAuth } from '@/features/auth/hooks/use-auth';

function LoginComponent() {
  const { user, isAuthenticated, login, logout, isLoading, error } = useAuth();

  // Login
  await login('user@example.com', 'password');

  // User data automatically available after login
  console.log(user.full_name, user.email, user.roles);

  // Logout
  logout(); // Clears state and redirects
}
```

**For complete documentation, see [AUTH_GUIDE.md](AUTH_GUIDE.md)**.

**API Hooks**:
```typescript
// Import directly from frappe-react-sdk
import {
  useFrappeGetDoc,
  useFrappeGetDocList,
  useFrappeCreateDoc,
  useFrappeUpdateDoc,
  useFrappeDeleteDoc,
  useFrappePostCall,
  useFrappeGetCall
} from 'frappe-react-sdk';

// Fetch single document
const { data, error, isLoading } = useFrappeGetDoc('User', 'john@example.com');

// Fetch document list
const { data, error, isLoading } = useFrappeGetDocList('User', {
  fields: ['name', 'email', 'full_name'],
  filters: [['enabled', '=', 1]],
  limit: 20
});

// Create document
const { createDoc, loading } = useFrappeCreateDoc();
await createDoc('User', { email: 'test@example.com' });

// Update document
const { updateDoc, loading } = useFrappeUpdateDoc();
await updateDoc('User', 'john@example.com', { full_name: 'John Doe' });

// Delete document
const { deleteDoc, loading } = useFrappeDeleteDoc();
await deleteDoc('User', 'john@example.com');

// Call custom API method
const { call, loading } = useFrappePostCall('my.custom.method');
await call({ arg1: 'value' });
```

**Token Storage**:
The token is stored in a platform-aware manner:
- **Web**: localStorage
- **Mobile**: localStorage (Capacitor-compatible)
- Automatic expiry handling
- Persistent across app restarts

**File Structure**:
```
src/
├── providers/
│   └── frappe-provider.tsx      # Frappe SDK provider
├── utils/
│   └── token-storage.ts         # Platform-aware token storage
├── types/
│   └── frappe.types.ts          # TypeScript type definitions
└── constants/
    └── frappe.ts                # Frappe constants and config
```

**Feature-Based Auth Implementation**:
```
src/features/auth/
├── hooks/
│   └── use-frappe-auth.ts       # Custom auth hook with token management
├── components/
│   ├── login-form.tsx           # Login form component
│   └── protected-route.tsx      # Route protection component
└── index.ts                     # Public exports
```

**Note**:
- All Frappe API hooks (`useFrappeAuth`, `useFrappeGetDoc`, `useFrappeCreateDoc`, etc.) are imported directly from `frappe-react-sdk`
- Authentication logic should be defined in your auth feature folder
- Use the provided `token-storage` utilities for bearer token management

### General API Integration

**Recommended structure** for other APIs:
```
feature/
├── services/
│   ├── api.ts         # API endpoints
│   └── queries.ts     # React Query/SWR hooks
└── types/
    └── api.types.ts   # API response types
```

**Example**:
```typescript
// feature/services/api.ts
export const fetchUsers = async () => {
  const response = await fetch('/api/users');
  return response.json();
};

// feature/services/queries.ts
import useSWR from 'swr';
import { fetchUsers } from './api';

export const useUsers = () => {
  return useSWR('/api/users', fetchUsers);
};
```

## Testing Strategy

**Recommended approach**:
- **Unit tests**: Utils, hooks, business logic
- **Component tests**: Atomic components with Vitest
- **E2E tests**: Critical user flows with Cypress
- **Mobile tests**: Device testing with Android/iOS builds

## Security Considerations

1. **Environment variables**: Use `.env` files (not committed)
2. **API keys**: Never commit API keys
3. **Native permissions**: Request only needed permissions
4. **Content Security Policy**: Configure CSP headers
5. **HTTPS only**: Use HTTPS in production

## Performance Optimization

### Web
- Vite optimization (code splitting, tree shaking)
- Lazy loading routes
- Image optimization (unplugin-imagemin)
- Compression (vite-plugin-compression2)
- PWA caching strategy

### Mobile
- Relative asset paths (`base: './'`)
- Optimized APK size (ProGuard for Android)
- Native feature lazy loading
- Efficient state management

## Build Outputs

### Web (PWA)
- **Location**: `build/web/`
- **Size**: ~500 KB (gzipped ~160 KB)
- **Deploy**: Any static host (Netlify, Vercel, etc.)
- **Contains**: Optimized HTML, CSS, JS, assets, service worker, manifest

### Android
- **Native Project**: `build/android/`
- **Web Assets Sync**: `build/android/app/src/main/assets/public/` (from `build/web/`)
- **Debug APK**: `build/android/app/build/outputs/apk/debug/app-debug.apk` (~4-5 MB)
- **Release APK**: `build/android/app/build/outputs/apk/release/app-release.apk`
- **AAB (Play Store)**: `build/android/app/build/outputs/bundle/release/app-release.aab`

### iOS (macOS only)
- **Native Project**: `build/ios/`
- **Web Assets Sync**: `build/ios/App/App/public/` (from `build/web/`)
- **Debug**: `build/ios/App/build/Build/Products/Debug-iphonesimulator/App.app`
- **Release**: `build/ios/App/build/Build/Products/Release-iphoneos/App.ipa`

## Related Documentation

- [ROUTING_GUIDE.md](./ROUTING_GUIDE.md) - **File-based routing guide** (Next.js-style)
- [CAPACITOR_IMPLEMENTATION_GUIDE.md](./CAPACITOR_IMPLEMENTATION_GUIDE.md) - Setup Capacitor
- [CAPACITOR_GUIDE.md](./CAPACITOR_GUIDE.md) - Use Capacitor features
- [BUILD_ANDROID_APK.md](./BUILD_ANDROID_APK.md) - Build Android apps
- [MOBILE_DEVELOPMENT.md](./MOBILE_DEVELOPMENT.md) - Mobile workflow
- [I18N_GUIDE.md](./I18N_GUIDE.md) - Internationalization
- [CREATE_PAGE.md](./CREATE_PAGE.md) - Create new pages
- [PWA_SETUP.md](./PWA_SETUP.md) - PWA features
- [FRAPPE_INTEGRATION.md](./FRAPPE_INTEGRATION.md) - Frappe backend integration

---

**Architecture Version**: 2.0
**Last Updated**: 2025-10-17
**Tech Stack**: React 19 + TypeScript 5 + Vite 7 + Capacitor 7 + Tailwind 4
