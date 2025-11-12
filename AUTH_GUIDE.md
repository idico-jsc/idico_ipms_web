# Authentication Guide

Complete guide to authentication implementation in this React TypeScript project.

## Overview

This project implements a secure, token-based authentication system with:

- **Bearer token authentication** via JWT
- **Hybrid token storage**: HTTP-only cookies (preferred) + localStorage fallback
- **Zustand state management** for global auth state
- **Automatic token injection** in all API requests
- **Auto-initialization** on page load
- **Auto-logout** on token expiry or 401/403 responses

## Table of Contents

- [Architecture](#architecture)
- [Token Storage](#token-storage)
- [API Authentication](#api-authentication)
- [Auth Store (Zustand)](#auth-store-zustand)
- [Using Authentication](#using-authentication)
- [Login Flow](#login-flow)
- [Logout Flow](#logout-flow)
- [Protected Routes](#protected-routes)
- [Endpoint Configuration](#endpoint-configuration)
- [Security Best Practices](#security-best-practices)

---

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Load                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
         ┌────────────▼────────────┐
         │  useAuthInitializer()   │
         │  - Check token exists   │
         │  - Fetch user if token  │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   Auth Store (Zustand)  │
         │   - user: FrappeUser    │
         │   - isAuthenticated     │
         │   - login/logout        │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │    useAuth() Hook       │
         │    (Components)         │
         └─────────────────────────┘
```

### File Structure

```
src/
├── features/auth/
│   ├── components/
│   │   └── login-form.tsx          # Login UI
│   ├── config/
│   │   └── endpoints.ts            # API endpoint constants
│   ├── hooks/
│   │   ├── use-auth.ts             # Main auth hook
│   │   └── use-auth-initializer.ts # Auto-init on load
│   ├── services/
│   │   ├── token-storage.ts        # Token management
│   │   └── auth-helpers.ts         # Logout/redirect helpers
│   ├── store/
│   │   └── auth-store.ts           # Zustand store
│   ├── types/
│   │   └── auth.types.ts           # TypeScript types
│   └── utils/
│       ├── index.ts                # Token expiry helpers
│       └── cleanup-old-storage.ts  # Migration utility
├── lib/
│   └── api.ts                      # API client with auth
└── config/
    └── api.ts                      # Global API config
```

---

## Token Storage

### Strategy

The project uses a **hybrid storage approach**:

1. **Server-set HttpOnly cookies** (Most secure - recommended)
2. **Client-side cookies** (Fallback if server doesn't set HttpOnly)
3. **localStorage** (Fallback for compatibility, especially mobile apps)

### Implementation

```typescript
// src/features/auth/services/token-storage.ts

// Store token
setToken(token: string, expiresIn?: number)
// Priority: Write to both cookies AND localStorage

// Get token
getToken(): string | null
// Priority: Read from cookies first, fallback to localStorage

// Remove token
removeToken(): void
// Clears both cookies AND localStorage

// Check if token exists
hasToken(): boolean
```

### Cookie Configuration

```typescript
// When storing in cookies
{
  sameSite: 'Strict',  // CSRF protection
  secure: true,        // HTTPS only (production)
  expires: Date        // Token expiry
}
```

### Native App Support

For **Capacitor/mobile apps**, only localStorage is used (cookies don't work reliably in WebViews).

---

## API Authentication

### Automatic Token Injection

All API requests automatically include the bearer token:

```typescript
// src/lib/api.ts

// Every request automatically adds:
Authorization: Bearer <token>
```

### API Methods

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

// GET request (authenticated by default)
const data = await apiGet<User>('/api/user');

// POST request
const result = await apiPost<Response>('/api/endpoint', { data });

// Disable auth for public endpoints
const publicData = await apiGet<Data>('/public/endpoint', false);
```

### Authenticated Fetcher

For custom requests:

```typescript
const Fetcher = async (endpoint, { options, requireAuth = true }) => {
  // Auto-injects token if requireAuth is true
  // Handles 401/403 responses
  // Returns parsed JSON
};
```

### Error Handling

401/403 responses trigger automatic logout:

```typescript
if (response.status === 401 || response.status === 403) {
  // Clear auth state
  // Redirect to login
  throw new Error("Unauthorized");
}
```

---

## Auth Store (Zustand)

### State Management

```typescript
// src/features/auth/store/auth-store.ts

interface AuthState {
  user: FrappeUser | null;      // User profile (in memory only)
  isLoading: boolean;             // Loading state
  isInitialized: boolean;         // Init check done
  error: string | null;           // Error messages
  isAuthenticated: boolean;       // Computed from user
}
```

### Actions

```typescript
// Login
await store.login(email, password);

// Logout
store.logout();

// Clear auth (without redirect)
store.clearAuth();

// Fetch user profile
await store.fetchUserProfile();

// Initialize (check token + fetch user)
await store.initialize();
```

### No Persistence

**Important**: User data is stored in **memory only** (Zustand state), NOT in localStorage.

- ✅ Token persisted in cookies/localStorage
- ❌ User data NOT persisted
- 🔄 User data fetched fresh on each page load using token

---

## Using Authentication

### Basic Usage

```typescript
import { useAuth } from '@/features/auth/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading, error } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome {user.full_name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### User Data

The `user` object contains:

```typescript
interface FrappeUser {
  name: string;                              // Username
  email: string;                             // Email
  full_name?: string;                        // Display name
  user_image?: string;                       // Avatar URL
  enabled: boolean;                          // Account status
  user_type?: 'System User' | 'Website User';
  roles?: string[];                          // User roles
  creation?: string;                         // Account created date
  modified?: string;                         // Last modified date
}
```

---

## Login Flow

### 1. User Submits Credentials

```typescript
const { login } = useAuth();

await login(email, password);
```

### 2. Store Processes Login

```typescript
// auth-store.ts
login: async (email, password) => {
  // 1. Call login API
  const response = await apiPost('/method/login', {
    usr: email,
    pwd: password,
    use_jwt: 1
  });

  // 2. Store token in cookies + localStorage
  if (response.token) {
    setToken(response.token, expiresIn);
  }

  // 3. Fetch user profile
  await fetchUserProfile();

  // 4. Update state
  set({ user, isAuthenticated: true });
}
```

### 3. API Request Flow

```
Login Request → Server
     ↓
Token Received
     ↓
Store in Cookies + localStorage
     ↓
Fetch User Profile (with token in header)
     ↓
Store User in Zustand
     ↓
User Authenticated ✓
```

---

## Logout Flow

### Manual Logout

```typescript
const { logout } = useAuth();

logout(); // Clears state + redirects to /login
```

### Auto Logout (401/403)

```typescript
// Triggered automatically on unauthorized responses
if (response.status === 401 || response.status === 403) {
  handleUnauthorized();
  // → Clear tokens
  // → Clear Zustand state
  // → Redirect to /login
}
```

### Implementation

```typescript
// auth-helpers.ts
export function logout() {
  // 1. Clear tokens
  removeToken();

  // 2. Clear Zustand state
  useAuthStore.getState().clearAuth();

  // 3. Redirect to login
  window.location.href = '/login';
}
```

---

## Protected Routes

### Route Protection

```typescript
// App routes with protection
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### ProtectedRoute Component

```typescript
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### Auth Routes (Logged-in users)

```typescript
// Prevent logged-in users from accessing login
<Route
  path="/login"
  element={
    <AuthRoute>
      <LoginPage />
    </AuthRoute>
  }
/>
```

---

## Endpoint Configuration

### Centralized Endpoints

```typescript
// src/features/auth/config/endpoints.ts

export const AUTH_ENDPOINTS = {
  LOGIN: '/method/login',
  GET_CURRENT_USER: '/method/parent_portal.api.login.get_current_user_info',
  LOGOUT: '/method/logout',
} as const;
```

### Usage

```typescript
import { AUTH_ENDPOINTS } from '../config/endpoints';

// Instead of hardcoded strings
await apiPost(AUTH_ENDPOINTS.LOGIN, data);
```

### Global API Config

```typescript
// src/config/api.ts

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  FRAPPE_URL: import.meta.env.VITE_FRAPPE_URL,
  TOKEN_EXPIRY_DAYS: 7,
  TIMEOUT: 30000,
};

// Helper function
export const getTokenExpirySeconds = (): number => {
  return API_CONFIG.TOKEN_EXPIRY_DAYS * 24 * 60 * 60;
};
```

---

## Security Best Practices

### ✅ Implemented

- **Bearer token authentication** (JWT)
- **HttpOnly cookies** support (server-set)
- **SameSite=Strict** cookie flag (CSRF protection)
- **Secure flag** for cookies (HTTPS only)
- **Token expiry** validation
- **Automatic logout** on 401/403
- **credentials: 'include'** for HttpOnly cookie support
- **No user data in localStorage** (only token)

### 🔒 Recommendations

1. **Server-side**: Always set HttpOnly cookies with proper flags:
   ```
   Set-Cookie: auth_token=<JWT>; HttpOnly; Secure; SameSite=Strict; Max-Age=<seconds>
   ```

2. **HTTPS**: Always use HTTPS in production

3. **Token Rotation**: Implement refresh tokens for long-lived sessions

4. **CORS**: Configure proper CORS headers on backend

5. **CSP**: Add Content Security Policy headers

6. **Rate Limiting**: Implement login attempt rate limiting

---

## Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=https://your-api.com
VITE_FRAPPE_URL=https://your-frappe-instance.com

# Token Configuration
VITE_FRAPPE_TOKEN_EXPIRY_DAYS=7
```

---

## Troubleshooting

### Token not being sent

**Check:**
- Token exists: `console.log(getToken())`
- Request headers: Check Network tab
- CORS configuration on server

### Auto-logout not working

**Check:**
- API returns proper 401/403 status codes
- `handleUnauthorized` is imported correctly

### User data not persisting

**Expected behavior**: User data is NOT persisted.
- On page refresh, user data is fetched fresh from API using stored token
- Only token persists, not user data

### Mobile app issues

For Capacitor apps:
- Use localStorage only (no cookies)
- Check `isNative()` detection works
- Verify token storage in mobile debug tools

---

## Migration Notes

### From Previous Version

If migrating from a version that stored user in localStorage:

```typescript
// Old localStorage data is automatically cleaned up
// See: src/features/auth/utils/cleanup-old-storage.ts
localStorage.removeItem('auth-storage');
```

---

## API Reference

### useAuth Hook

```typescript
const {
  user,              // FrappeUser | null
  isAuthenticated,   // boolean
  isLoading,         // boolean
  error,             // string | null
  login,             // (email, password) => Promise<void>
  logout,            // () => void
} = useAuth();
```

### Token Storage

```typescript
import {
  getToken,      // () => string | null
  setToken,      // (token, expiresIn?) => void
  removeToken,   // () => void
  hasToken,      // () => boolean
} from '@/features/auth/services/token-storage';
```

### Auth Helpers

```typescript
import {
  logout,                  // () => void
  handleUnauthorized,      // () => void
  isAuthenticated,         // () => boolean
  getRedirectAfterLogin,   // () => string | null
} from '@/features/auth/services/auth-helpers';
```

---

## Examples

### Login Form

```typescript
import { useAuth } from '@/features/auth/hooks/use-auth';

function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // User is now logged in and redirected
    } catch (err) {
      // Error is already set in store
      console.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
}
```

### Profile Display

```typescript
import { useAuth } from '@/features/auth/hooks/use-auth';

function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div>
      <img src={user.user_image} alt={user.full_name} />
      <h2>{user.full_name}</h2>
      <p>{user.email}</p>
      <p>Roles: {user.roles?.join(', ')}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protected API Call

```typescript
import { apiGet } from '@/lib/api';

async function fetchUserData() {
  // Token automatically included
  const data = await apiGet<UserData>('/api/user/profile');
  return data;
}
```

---

## Summary

This authentication system provides:

- ✅ Secure token-based authentication
- ✅ Hybrid storage (cookies + localStorage)
- ✅ Automatic token injection
- ✅ Global state management (Zustand)
- ✅ Auto-initialization on page load
- ✅ Protected routes
- ✅ Type-safe APIs
- ✅ Mobile app support
- ✅ Production-ready security

For more details, see the source code in `src/features/auth/`.
