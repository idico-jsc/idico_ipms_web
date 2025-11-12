# Frappe Integration Guide

This project includes built-in support for Frappe Framework backend using bearer token authentication with Zustand state management.

> **For complete authentication documentation, see [AUTH_GUIDE.md](AUTH_GUIDE.md)**

## 📦 What's Included

### Core Integration Files

1. **Provider** - `src/providers/frappe-provider.tsx`
   - Wraps the app with FrappeProvider from frappe-react-sdk
   - Automatically configures bearer token authentication
   - Retrieves token from platform-aware storage

2. **Token Storage** - `src/features/auth/services/token-storage.ts`
   - Hybrid storage: HTTP-only cookies (preferred) + localStorage fallback
   - Platform-aware token management (web + mobile)
   - Automatic token expiry handling
   - Functions: `getToken()`, `setToken()`, `removeToken()`, `hasToken()`, etc.

3. **TypeScript Types** - `src/types/frappe.types.ts`
   - Comprehensive type definitions for Frappe API
   - Types for users, documents, authentication, errors, etc.

4. **Constants** - `src/constants/frappe.ts`
   - Storage keys, API endpoints, doctypes
   - Error messages
   - Environment variable access

## 🔧 Configuration

### Environment Variables

Add to `.env.development` or `.env.production`:

```env
# Frappe API Configuration
VITE_FRAPPE_URL=https://your-frappe-server.frappe.cloud
VITE_FRAPPE_USE_TOKEN=true
```

### Provider Setup

The FrappeProvider is already configured in `src/providers/providers.tsx`:

```tsx
<I18nProvider>
  <SWRProvider>
    <FrappeProvider>{children}</FrappeProvider>
  </SWRProvider>
</I18nProvider>
```

## 🚀 Usage

### Authentication

The project has a complete authentication system with Zustand state management:

```
src/features/auth/
├── components/
│   ├── login-form.tsx
│   └── protected-route.tsx
├── config/
│   └── endpoints.ts              # API endpoint constants
├── hooks/
│   ├── use-auth.ts               # Main auth hook
│   └── use-auth-initializer.ts  # Auto-init on load
├── services/
│   ├── token-storage.ts          # Token management
│   └── auth-helpers.ts           # Logout helpers
├── store/
│   └── auth-store.ts             # Zustand store
└── types/
    └── auth.types.ts             # TypeScript types
```

**Using Authentication**:

```typescript
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useState } from 'react';

export function LoginForm() {
  const { login, user, isAuthenticated, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Login with email and password
      await login(email, password);
      // User is now logged in, token stored, user data fetched
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
```

### API Operations

Import hooks directly from `frappe-react-sdk`:

```typescript
import {
  useFrappeGetDoc,
  useFrappeGetDocList,
  useFrappeCreateDoc,
  useFrappeUpdateDoc,
  useFrappeDeleteDoc,
  useFrappePostCall,
  useFrappeGetCall,
} from 'frappe-react-sdk';

// Fetch single document
function UserProfile({ email }: { email: string }) {
  const { data, error, isLoading } = useFrappeGetDoc('User', email);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Hello {data?.full_name}</div>;
}

// Fetch document list
function UserList() {
  const { data, error, isLoading } = useFrappeGetDocList('User', {
    fields: ['name', 'email', 'full_name'],
    filters: [['enabled', '=', 1]],
    limit: 20,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.map((user) => (
        <li key={user.name}>{user.full_name}</li>
      ))}
    </ul>
  );
}

// Create document
function CreateUser() {
  const { createDoc, loading, error } = useFrappeCreateDoc();

  const handleCreate = async () => {
    try {
      const newUser = await createDoc('User', {
        email: 'newuser@example.com',
        first_name: 'New',
        last_name: 'User',
      });
      console.log('Created:', newUser);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? 'Creating...' : 'Create User'}
    </button>
  );
}

// Update document
function UpdateUser({ email }: { email: string }) {
  const { updateDoc, loading } = useFrappeUpdateDoc();

  const handleUpdate = async () => {
    await updateDoc('User', email, {
      full_name: 'Updated Name',
    });
  };

  return (
    <button onClick={handleUpdate} disabled={loading}>
      Update User
    </button>
  );
}

// Call custom API method
function CustomAPICall() {
  const { call, loading } = useFrappePostCall('my.custom.method');

  const handleCall = async () => {
    const result = await call({
      arg1: 'value1',
      arg2: 'value2',
    });
    console.log('Result:', result);
  };

  return (
    <button onClick={handleCall} disabled={loading}>
      Call API
    </button>
  );
}
```

## 🔐 Token Storage Utilities

Available from `@/utils/token-storage`:

```typescript
import {
  getToken,
  setToken,
  removeToken,
  hasToken,
  getTokenExpiry,
  isTokenExpired,
  getTimeUntilExpiry,
} from '@/utils/token-storage';

// Get current token
const token = getToken(); // Returns string | null

// Set token with expiry (in seconds)
setToken('your-bearer-token', 3600); // Expires in 1 hour

// Remove token
removeToken();

// Check if valid token exists
if (hasToken()) {
  // User is authenticated
}

// Get token expiry timestamp
const expiry = getTokenExpiry(); // Returns number | null

// Check if token is expired
if (isTokenExpired()) {
  // Token has expired
}

// Get seconds until expiry
const seconds = getTimeUntilExpiry(); // Returns number | null
```

## 📱 Platform Support

The token storage works on both web and mobile:

- **Web**: Uses `localStorage`
- **Mobile (Capacitor)**: Uses `localStorage` (Capacitor-compatible)
- Automatic platform detection
- Persistent across app restarts

## 🛡️ Protected Routes

Create a protected route component:

```typescript
// src/features/auth/components/protected-route.tsx
import { Navigate } from 'react-router-dom';
import { hasToken } from '@/utils/token-storage';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!hasToken()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

Use it in your router:

```typescript
import { ProtectedRoute } from '@/features/auth';

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

## 📚 TypeScript Types

All Frappe types are available from `@/types/frappe.types`:

```typescript
import type {
  FrappeUser,
  FrappeDoc,
  FrappeError,
  FrappeAuthResponse,
  FrappeTokenResponse,
  FrappeListResponse,
} from '@/types/frappe.types';
```

## 📖 Additional Resources

- [frappe-react-sdk Documentation](https://github.com/nikkothari22/frappe-react-sdk)
- [Frappe Framework Documentation](https://frappeframework.com/docs)
- [Frappe REST API](https://frappeframework.com/docs/user/en/api/rest)

## 🔍 Troubleshooting

### Token not being sent with requests

Make sure:
1. `VITE_FRAPPE_USE_TOKEN=true` in your `.env` file
2. Token is set using `setToken()` before making API calls
3. FrappeProvider is configured in providers.tsx

### CORS errors

Configure CORS on your Frappe server:
- Add your frontend URL to `site_config.json`
- Set appropriate CORS headers

### Token expiry

Implement token refresh logic in your auth feature:

```typescript
useEffect(() => {
  const checkTokenExpiry = () => {
    if (isTokenExpired()) {
      // Redirect to login or refresh token
      removeToken();
      navigate('/login');
    }
  };

  const interval = setInterval(checkTokenExpiry, 60000); // Check every minute
  return () => clearInterval(interval);
}, []);
```
