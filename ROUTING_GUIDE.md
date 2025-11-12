# Routing Guide - Next.js-Style App Router

This project uses a **Next.js-inspired file-based routing system** for React applications. Routes are automatically generated based on folder structure, making it intuitive and easy to maintain.

## Table of Contents

- [Overview](#overview)
- [File Conventions](#file-conventions)
- [Folder Structure](#folder-structure)
- [Creating Routes](#creating-routes)
- [Layouts](#layouts)
- [Route Groups](#route-groups)
- [Error Boundaries](#error-boundaries)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Overview

The routing system automatically discovers routes from the `src/app/` directory. Each route is defined by:

1. **Folder structure** = URL path
2. **Special files** = Route behavior

### Key Principles

✅ **File-based routing**: Folders define URL segments
✅ **Convention over configuration**: No manual route registration
✅ **Automatic layout cascading**: Layouts wrap child routes automatically
✅ **Route groups**: Organize without affecting URLs
✅ **Type-safe**: Full TypeScript support

## File Conventions

### Core Files

| File | Purpose | Example |
|------|---------|---------|
| `page.tsx` | Makes route publicly accessible | `app/about/page.tsx` → `/about` |
| `layout.tsx` | Shared UI wrapper for routes | `app/layout.tsx` wraps all routes |
| `error.tsx` | Error boundary for route | Catches errors in route segment |
| `not-found.tsx` | 404 page | Catch-all route fallback |

### Special Folders

| Folder | Purpose | Example |
|--------|---------|---------|
| `(folder)` | Route group (not in URL) | `app/(auth)/login` → `/login` |
| `_folder` | Private folder (excluded) | `app/_components/` (not routable) |

## Folder Structure

### Basic Structure

```
src/app/
├── layout.tsx           # Root layout (wraps all routes)
├── page.tsx             # Home page → /
├── not-found.tsx        # 404 page → /*
├── error.tsx            # Root error boundary
│
├── about/
│   └── page.tsx         # /about
│
├── contact/
│   └── page.tsx         # /contact
│
└── (auth)/              # Route group (not in URL)
    ├── layout.tsx       # Auth layout (wraps /login, /register)
    ├── login/
    │   └── page.tsx     # /login
    └── register/
        └── page.tsx     # /register
```

### Advanced Structure

```
src/app/
├── layout.tsx                  # Root layout
├── page.tsx                    # / (home)
├── routes.tsx                  # Router (auto-generated, don't edit)
│
├── (marketing)/                # Route group
│   ├── layout.tsx              # Marketing layout
│   ├── about/
│   │   └── page.tsx            # /about
│   ├── pricing/
│   │   └── page.tsx            # /pricing
│   └── contact/
│       └── page.tsx            # /contact
│
├── (auth)/                     # Route group
│   ├── layout.tsx              # Auth layout
│   ├── login/
│   │   └── page.tsx            # /login
│   ├── register/
│   │   └── page.tsx            # /register
│   └── forgot-password/
│       └── page.tsx            # /forgot-password
│
├── dashboard/
│   ├── layout.tsx              # Dashboard layout
│   ├── page.tsx                # /dashboard
│   ├── profile/
│   │   └── page.tsx            # /dashboard/profile
│   └── settings/
│       └── page.tsx            # /dashboard/settings
│
└── _components/                # Private folder (not routed)
    └── shared-component.tsx
```

## Creating Routes

### 1. Simple Page Route

**Create**: `src/app/about/page.tsx`

```tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our about page</p>
    </div>
  );
}
```

**Result**: Accessible at `/about`

### 2. Nested Route

**Create**: `src/app/blog/posts/page.tsx`

```tsx
export default function BlogPostsPage() {
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        <li>Post 1</li>
        <li>Post 2</li>
      </ul>
    </div>
  );
}
```

**Result**: Accessible at `/blog/posts`

### 3. Route with Data Fetching

```tsx
import { useFrappeGetDocList } from 'frappe-react-sdk';

export default function ProductsPage() {
  const { data, error, isLoading } = useFrappeGetDocList('Product', {
    fields: ['name', 'title', 'price'],
    limit: 20
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {data?.map(product => (
          <li key={product.name}>{product.title} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Layouts

Layouts wrap child routes and maintain state across navigation.

### Root Layout (Required)

**File**: `src/app/layout.tsx`

```tsx
import { ReactNode } from 'react';
import { Header } from '@/components/organisms/header';
import { VersionDisplay } from '@/components/atoms/version-display';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      <VersionDisplay position="bottom-right" />
    </div>
  );
}
```

### Nested Layout

**File**: `src/app/dashboard/layout.tsx`

```tsx
import { ReactNode } from 'react';
import { Sidebar } from '@/features/dashboard/components/sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
```

**Result**: Wraps all `/dashboard/*` routes

### Layout Cascading

Layouts automatically nest from root to leaf:

```
Root Layout
└── Dashboard Layout
    └── Page Content
```

Example for `/dashboard/profile`:
1. Root Layout wraps everything
2. Dashboard Layout wraps dashboard pages
3. Profile Page is the content

## Route Groups

Route groups organize files without affecting the URL.

### Use Cases

✅ Organize routes by feature
✅ Apply different layouts to different sections
✅ Logical grouping without URL impact

### Example: Auth Routes

**Structure**:
```
app/
└── (auth)/
    ├── layout.tsx
    ├── login/
    │   └── page.tsx
    └── register/
        └── page.tsx
```

**URLs**:
- `/login` (not `/auth/login`)
- `/register` (not `/auth/register`)

**Layout**: `(auth)/layout.tsx` applies to both login and register

### Auth Layout Example

**File**: `src/app/(auth)/layout.tsx`

```tsx
import { ReactNode } from 'react';
import { AuthRoute } from '@/features/auth/components/auth-route';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </AuthRoute>
  );
}
```

## Error Boundaries

Error boundaries catch errors in route segments.

### Root Error Boundary

**File**: `src/app/error.tsx`

```tsx
import { Link } from 'react-router';

export default function ErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          An error occurred while rendering this page
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
```

### Nested Error Boundary

**File**: `src/app/dashboard/error.tsx`

```tsx
export default function DashboardErrorBoundary() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
      <p>Something went wrong in the dashboard</p>
      <button onClick={() => window.location.reload()}>
        Reload Dashboard
      </button>
    </div>
  );
}
```

## Examples

### Example 1: Marketing Website

```
app/
├── layout.tsx              # Header + Footer
├── page.tsx                # Home (/)
├── about/
│   └── page.tsx            # /about
├── pricing/
│   └── page.tsx            # /pricing
└── contact/
    └── page.tsx            # /contact
```

### Example 2: Dashboard App

```
app/
├── layout.tsx                     # Root layout
├── page.tsx                       # Landing page (/)
│
├── (auth)/                        # Route group
│   ├── layout.tsx                 # Auth layout
│   ├── login/
│   │   └── page.tsx               # /login
│   └── register/
│       └── page.tsx               # /register
│
└── dashboard/
    ├── layout.tsx                 # Dashboard layout
    ├── page.tsx                   # /dashboard
    ├── profile/
    │   └── page.tsx               # /dashboard/profile
    └── settings/
        └── page.tsx               # /dashboard/settings
```

### Example 3: Protected Routes

**Dashboard Layout with Protection**:

```tsx
// app/dashboard/layout.tsx
import { ReactNode } from 'react';
import { ProtectedRoute } from '@/features/auth/components/protected-route';
import { Sidebar } from './sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
```

## Best Practices

### 1. Route Organization

✅ **DO**: Group related routes
```
app/(auth)/
  ├── login/
  ├── register/
  └── forgot-password/
```

❌ **DON'T**: Scatter auth routes
```
app/
  ├── login/
  ├── register/
  └── forgot-password/
```

### 2. Layout Usage

✅ **DO**: Use layouts for shared UI
```tsx
// app/dashboard/layout.tsx
<div>
  <Sidebar />    {/* Shared across all dashboard pages */}
  {children}
</div>
```

❌ **DON'T**: Repeat UI in every page
```tsx
// app/dashboard/profile/page.tsx
<div>
  <Sidebar />    {/* Repeated! */}
  <ProfileContent />
</div>
```

### 3. Private Folders

✅ **DO**: Use private folders for utilities
```
app/
  ├── _components/      # Shared page components
  ├── _utils/          # Page-specific utils
  └── dashboard/
      └── page.tsx
```

❌ **DON'T**: Put utilities in routable folders
```
app/
  ├── components/      # Will try to route!
  └── dashboard/
      └── page.tsx
```

### 4. File Naming

✅ **DO**: Use exact file names
- `page.tsx` (not `index.tsx`)
- `layout.tsx` (not `Layout.tsx`)
- `error.tsx` (not `ErrorBoundary.tsx`)

❌ **DON'T**: Use custom names
- `index.tsx` ❌
- `Layout.tsx` ❌
- `ErrorPage.tsx` ❌

### 5. Component Organization

✅ **DO**: Keep page logic minimal
```tsx
// app/products/page.tsx
import { ProductList } from '@/features/products/components/product-list';

export default function ProductsPage() {
  return <ProductList />;
}
```

❌ **DON'T**: Put business logic in pages
```tsx
// app/products/page.tsx
export default function ProductsPage() {
  // 200 lines of business logic...
  return <div>...</div>;
}
```

### 6. Route Protection

✅ **DO**: Protect at layout level
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
```

❌ **DON'T**: Protect individual pages
```tsx
// app/dashboard/profile/page.tsx
export default function ProfilePage() {
  return (
    <ProtectedRoute>    {/* Repeated! */}
      <Profile />
    </ProtectedRoute>
  );
}
```

## Migration Guide

### From React Router

**Before** (manual routes):
```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/contact" element={<Contact />} />
</Routes>
```

**After** (file-based):
```
app/
├── page.tsx       # Home
├── about/
│   └── page.tsx   # About
└── contact/
    └── page.tsx   # Contact
```

### From Next.js Pages Router

**Before** (pages/):
```
pages/
├── index.tsx
├── about.tsx
└── blog/
    └── [slug].tsx
```

**After** (app/):
```
app/
├── page.tsx
├── about/
│   └── page.tsx
└── blog/
    └── [slug]/
        └── page.tsx
```

## How It Works

The routing system uses **Vite's `import.meta.glob`** to auto-discover files:

1. **Discover Pages**: Finds all `page.tsx` files
2. **Discover Layouts**: Finds all `layout.tsx` files
3. **Generate Routes**: Maps folder structure to URL paths
4. **Apply Layouts**: Cascades layouts from root to leaf
5. **Handle Errors**: Wraps routes with error boundaries

### Example Flow

For route `/dashboard/profile`:

1. Find `app/dashboard/profile/page.tsx` ✅
2. Find layouts: `app/layout.tsx` + `app/dashboard/layout.tsx` ✅
3. Generate URL: `/dashboard/profile` ✅
4. Cascade: `RootLayout` → `DashboardLayout` → `ProfilePage` ✅

## Troubleshooting

### Route Not Found

**Problem**: Page doesn't load

**Solution**:
1. Ensure file is named `page.tsx` (not `index.tsx`)
2. Check file is in correct folder
3. Restart dev server

### Layout Not Applying

**Problem**: Layout doesn't wrap page

**Solution**:
1. Ensure file is named `layout.tsx`
2. Check layout is in parent folder
3. Verify layout exports default function

### Route Group Not Working

**Problem**: URL includes group name

**Solution**:
1. Ensure folder name has parentheses: `(auth)`
2. Check no typos in folder name

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall architecture
- [CREATE_PAGE.md](./CREATE_PAGE.md) - Create new pages
- [FRAPPE_INTEGRATION.md](./FRAPPE_INTEGRATION.md) - API integration

---

**Version**: 1.0
**Last Updated**: 2025-10-17
**Next.js Compatibility**: App Router conventions
