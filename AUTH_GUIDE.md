# Authentication Guide

Secure JWT-based authentication with Zustand, hybrid token storage, and auto-initialization.

## Features

- ✅ Bearer token (JWT) authentication
- ✅ Hybrid storage: HttpOnly cookies + localStorage
- ✅ Zustand global state (user NOT persisted)
- ✅ Auto token injection in API requests
- ✅ Auto-init on page load + auto-logout on 401/403

## Architecture

**Flow**: App Load → useAuthInitializer() → Auth Store (Zustand) → useAuth() hook → Components

**File Structure**:
```
src/features/auth/
├── components/      # login-form.tsx
├── config/          # endpoints.ts
├── hooks/           # use-auth.ts, use-auth-initializer.ts
├── services/        # token-storage.ts, auth-helpers.ts
├── store/           # auth-store.ts (Zustand)
└── types/           # auth.types.ts
```

## Token Storage

**Strategy**: Hybrid approach (priority order)
1. HttpOnly cookies (server-set, most secure)
2. Client cookies (SameSite=Strict, Secure in prod)
3. localStorage (fallback, mobile apps)

**API**: `setToken()`, `getToken()`, `removeToken()`, `hasToken()`

**Mobile**: Uses localStorage only (Capacitor WebView compatibility)

## API Authentication

**Automatic Token Injection**: All API requests automatically include `Authorization: Bearer <token>` header

**API Functions**: Use `apiGet`, `apiPost`, `apiPut`, `apiDelete` from `@/lib/api`
- Default: Authenticated requests
- Optional: Disable auth for public endpoints (pass `false` as second parameter)

**Auto-logout**: 401/403 responses trigger automatic logout → clear state → redirect to /login

## Auth Store (Zustand)

**State**: `user`, `isLoading`, `isInitialized`, `error`, `isAuthenticated`

**Actions**: `login()`, `logout()`, `clearAuth()`, `fetchUserProfile()`, `initialize()`

**Important**: User data in memory only (NOT persisted). Token persisted, user fetched fresh on page load.

## Usage Overview

### Basic Hook Usage

Import `useAuth` from auth hooks and access:
- `user` - User profile data (name, email, full_name, user_image, roles)
- `isAuthenticated` - Boolean authentication status
- `login(email, password)` - Login function
- `logout()` - Logout and redirect
- `isLoading` - Loading state
- `error` - Error messages

### Authentication Flows

**Login Flow**:
```
User submits credentials → API validates → Token stored → User profile fetched → Zustand updated → Authenticated
```

**Logout Flow**:
```
Manual: logout() → Clear token → Clear state → Redirect to /login
Auto: 401/403 response → handleUnauthorized() → Same as manual logout
```

## Protected Routes

**Implementation**: Wrap routes with `<ProtectedRoute>` component
- Checks `isAuthenticated` from useAuth hook
- Redirects to `/login` if not authenticated
- Prevents logged-in users from accessing login/register pages using `<AuthRoute>`

**Best Practice**: Protect at layout level to cover all child routes automatically

## Configuration

**Endpoints**: Centralized in `src/features/auth/config/endpoints.ts`
- LOGIN: `/method/login`
- GET_CURRENT_USER: `/method/parent_portal.api.login.get_current_user_info`
- LOGOUT: `/method/logout`

**Environment Variables Required**:
- `VITE_API_BASE_URL` - API base URL
- `VITE_FRAPPE_URL` - Frappe instance URL
- `VITE_FRAPPE_TOKEN_EXPIRY_DAYS` - Token expiry (default: 7 days)

## Security

**Implemented**:
- ✅ JWT bearer token authentication
- ✅ HttpOnly cookies (server-set) + SameSite=Strict + Secure
- ✅ Auto-logout on 401/403
- ✅ User data NOT in localStorage (only token)

**Recommendations**:
- Use HTTPS in production
- Configure CORS properly
- Implement rate limiting
- Add CSP headers
- Consider refresh tokens for long sessions

## API Reference

### Main Hook
**useAuth**: Returns user, isAuthenticated, isLoading, error, login(), logout()

### Token Storage Functions
- `getToken()` - Retrieve stored token
- `setToken(token, expiresIn)` - Store token with expiry
- `removeToken()` - Clear token from storage
- `hasToken()` - Check if token exists

### Helper Functions
- `logout()` - Clear auth and redirect
- `handleUnauthorized()` - Handle 401/403 responses
- `isAuthenticated()` - Check authentication status

## Implementation

All authentication logic is in `src/features/auth/`:
- `hooks/` - useAuth, useAuthInitializer
- `services/` - Token storage, auth helpers
- `store/` - Zustand auth store
- `components/` - Login form, protected routes
- `config/` - API endpoints

Refer to source code for detailed implementation.
