# Routing & Page Creation Guide

Complete guide for Next.js-style file-based routing and page creation with Atomic Design pattern.

## Overview

This project uses a Next.js-inspired file-based routing system where:
- **Routes automatically discovered** from `src/app/` folder structure
- **File conventions** define route behavior (page, layout, error)
- **Atomic Design separation**: Route entry points in `src/app/`, actual page components in `src/components/pages/`

### Key Principles

- File-based routing: Folders define URL segments
- Convention over configuration: No manual route registration
- Automatic layout cascading: Layouts wrap child routes
- Route groups: Organize without affecting URLs
- Two-layer architecture: Route entry + Page component

## File Conventions

### Core Files

| File | Purpose | Example |
|------|---------|---------|
| `page.tsx` | Route entry point | `app/about/page.tsx` → `/about` |
| `layout.tsx` | Shared UI wrapper | `app/layout.tsx` wraps all routes |
| `error.tsx` | Error boundary | Catches errors in route segment |
| `not-found.tsx` | 404 page | Catch-all route fallback |

### Special Folders

| Folder | Purpose | Example |
|--------|---------|---------|
| `(folder)` | Route group (not in URL) | `app/(auth)/login` → `/login` |
| `_folder` | Private folder (excluded from routing) | `app/_components/` |
| `[param]` | Dynamic route parameter | `app/blog/[id]` → `/blog/:id` |

## Creating a New Page

### Quick Start (4 Steps)

**1. Create page component** in `src/components/pages/your-page.tsx`
- Use named export (PascalCase)
- Extend `React.ComponentProps<'div'>`
- Include responsive container

**2. Export from pages index**
- Add to `src/components/pages/index.ts`: `export { YourPage } from './your-page';`

**3. Create route config**
- Create folder: `src/app/your-page-name/`
- Add `route.ts` with path and optional errorBoundary setting

**4. Create route entry point**
- Create `page.tsx` that imports and renders your page component

**Result**: Route automatically registered at `/your-page-name`

### Why Two Layers?

**Benefits**:
1. **Reusability** - Page components can be used outside routes
2. **Testing** - Easier to test components independently
3. **Atomic Design** - Components organized in design system
4. **Flexibility** - Route layer handles route-specific logic (params, guards)

### File Structure Pattern

```
src/
├── app/
│   └── your-page-name/        # Route folder
│       ├── page.tsx           # Route entry (imports from components)
│       └── route.ts           # Route config
└── components/
    └── pages/
        ├── your-page.tsx      # Actual page component
        └── index.ts          # Export your page here
```

## Layouts

Layouts wrap child routes and maintain state across navigation.

### Root Layout (Required)

Location: `src/app/layout.tsx`
- Wraps all routes in the application
- Contains common UI: Header, Footer, Theme providers
- Renders `{children}` prop for route content

### Nested Layouts

Location: `src/app/[section]/layout.tsx`
- Wraps all routes under that section
- Can contain section-specific UI: Sidebar, Navigation
- Cascades from root: Root Layout → Section Layout → Page

### Layout Cascading

For route `/dashboard/profile`:
1. Root Layout (`app/layout.tsx`)
2. Dashboard Layout (`app/dashboard/layout.tsx`)
3. Profile Page (`app/dashboard/profile/page.tsx`)

Layouts automatically nest from root to leaf.

## Route Groups

Route groups organize files without affecting URLs using `(folder)` syntax.

### Use Cases

- Organize routes by feature (marketing, auth, dashboard)
- Apply different layouts to different sections
- Logical grouping without URL impact

### Example: Auth Routes

**Structure**:
```
app/
└── (auth)/
    ├── layout.tsx        # Auth layout
    ├── login/
    │   └── page.tsx      # /login (NOT /auth/login)
    └── register/
        └── page.tsx      # /register (NOT /auth/register)
```

**URLs**:
- `/login` - Parentheses removed from URL
- `/register` - Clean URLs without group name

**Layout**: `(auth)/layout.tsx` applies to both login and register pages.

## Dynamic Routes

Use Next.js-style `[param]` folder naming for dynamic URL segments.

### How It Works

- `[id]` folder → `:id` URL parameter
- `[slug]` folder → `:slug` URL parameter
- `[token]` folder → `:token` URL parameter

Access parameters using React Router's `useParams()` hook.

### Example: Blog Post by ID

**Folder**: `src/app/blog/[id]/page.tsx`
**Route**: `/blog/:id`
**URL**: `/blog/123` → `id = "123"`

**Implementation**: Use `useParams<{ id: string }>()` to access the parameter, handle missing params with redirect

### Multiple Dynamic Segments

**Folder**: `src/app/users/[userId]/posts/[postId]/page.tsx`
**Route**: `/users/:userId/posts/:postId`
**URL**: `/users/john/posts/42` → `userId = "john"`, `postId = "42"`

### Best Practices for Dynamic Routes

1. Always type params: `useParams<{ paramName: string }>()`
2. Handle missing params with redirects
3. Validate params before using them
4. Use slugs instead of IDs for SEO (e.g., `/blog/my-post-title`)
5. Add error boundaries for invalid routes

## Error Boundaries

Error boundaries catch errors in route segments.

### Root Error Boundary

Location: `src/app/error.tsx`
- Catches errors across entire application
- Provides fallback UI with error message
- Typically includes "Go Home" link

### Nested Error Boundary

Location: `src/app/[section]/error.tsx`
- Catches errors only in that section
- Can provide section-specific error handling
- Allows rest of app to continue working

## Route Protection

Protect routes at the layout level for efficiency.

### Dashboard Protection Example

Location: `src/app/dashboard/layout.tsx`
- Wrap layout children with `<ProtectedRoute>`
- All dashboard pages automatically protected
- Single point of authentication check

### Auth Route Protection

Location: `src/app/(auth)/layout.tsx`
- Wrap with `<AuthRoute>` to redirect logged-in users
- Prevents access to login/register when already authenticated

## Route Configuration

**File**: `route.ts` in each route folder

**Properties**:
- `path` (required) - URL path string
- `errorBoundary` (optional) - Enable error boundary (boolean)

**Examples**:
- Home: `path: '/'` with `errorBoundary: true`
- Standard: `path: '/about'`
- 404 catch-all: `path: '*'`

## Navigation

### Add to Header

Add new pages to navigation array in `src/components/organisms/header.tsx` with label and path

### Programmatic Navigation

**React Router Hooks**:
- `useNavigate()` - Navigate programmatically
- `useParams()` - Access URL parameters
- `NavLink` - Navigation link with active state

## Best Practices

### Route Organization
✅ Group related routes with `(folder)` syntax
❌ Don't scatter related routes across project

### Layout Usage
✅ Use layouts for shared UI (sidebar, nav)
❌ Don't repeat UI in every page

### Private Folders
✅ Use `_folder` for non-routable utilities and components
❌ Don't put utilities in routable folders

### File Naming
✅ Use exact names: `page.tsx`, `layout.tsx`, `error.tsx`
❌ Don't use custom names or wrong casing

### Component Organization
✅ Keep page logic minimal, import from components
❌ Don't put business logic in page files

### Route Protection
✅ Protect at layout level (covers all children)
❌ Don't protect individual pages

### Naming Conventions
- Route folders: kebab-case (`my-page`)
- Component files: PascalCase (`MyPage`)
- Private folders: underscore prefix (`_utils`)

## Troubleshooting

### Route Not Found

**Symptoms**: Page doesn't load, 404 error

**Solutions**:
- Ensure file named `page.tsx` (not `index.tsx`)
- Verify both `page.tsx` and `route.ts` exist
- Check `path` in `route.ts` matches URL
- Restart dev server
- Check browser console for errors

### Layout Not Applying

**Symptoms**: Layout doesn't wrap page

**Solutions**:
- Ensure file named `layout.tsx`
- Verify layout in parent folder
- Check layout exports default function
- Restart dev server

### Dynamic Route Not Working

**Symptoms**: 404 or params undefined

**Solutions**:
- Use `[param]` syntax in folder name
- Access params with `useParams()`
- Check param type definitions
- Verify route path doesn't have typos

### Changes Not Reflecting

**Symptoms**: Code changes not visible

**Solutions**:
- Restart dev server
- Clear browser cache
- Check for compilation errors in terminal
- Verify file saved correctly

## Testing Your Route

1. Start dev server: `npm run dev`
2. Navigate to your page URL
3. Check browser console for route registration logs
4. Verify layout applies correctly
5. Test navigation to/from your page
6. Test on mobile viewport

## Available Utilities

### Styling
- Tailwind CSS classes
- shadcn/ui components

### i18n
- `useTranslation()` from react-i18next
- Translation namespaces in `src/locales/`

### Routing
- `useNavigate()` - Programmatic navigation
- `useParams()` - URL parameters
- `NavLink` - Active link component
- `Navigate` - Redirect component

### Theme & Language
- `useTheme()` - Dark mode toggle
- `useLanguage()` - Language switching

### Platform Detection
- `usePlatform()` - Web vs native detection
- `isNative()`, `isAndroid()`, `isIOS()` utilities

## How It Works

The routing system uses Vite's `import.meta.glob` to auto-discover:

1. **Discover Pages**: Find all `page.tsx` files
2. **Discover Layouts**: Find all `layout.tsx` files
3. **Generate Routes**: Map folder structure to URL paths
4. **Apply Layouts**: Cascade layouts from root to leaf
5. **Handle Errors**: Wrap routes with error boundaries

### Auto-Discovery Flow

For route `/dashboard/profile`:
1. Find `app/dashboard/profile/page.tsx` ✅
2. Find layouts: `app/layout.tsx` + `app/dashboard/layout.tsx` ✅
3. Generate URL: `/dashboard/profile` ✅
4. Cascade: RootLayout → DashboardLayout → ProfilePage ✅

## Examples in This Project

**Route entry points** (`src/app/`):
- `app/home/page.tsx` - Imports Home component
- `app/about/page.tsx` - Imports About component
- `app/contact/page.tsx` - Imports Contact component
- `app/not-found/page.tsx` - Imports NotFound component

**Page components** (`src/components/pages/`):
- `pages/home.tsx` - Home page with counter
- `pages/about.tsx` - Static content page
- `pages/contact.tsx` - Form page
- `pages/not-found.tsx` - 404 page

## Migration From Other Routers

### From React Router
Change from manual route registration to file-based structure. Each route becomes a folder with `page.tsx`

### From Next.js Pages Router
Change `pages/index.tsx` → `app/page.tsx` and `pages/about.tsx` → `app/about/page.tsx`

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Overall project architecture
- [FRAPPE_INTEGRATION.md](./FRAPPE_INTEGRATION.md) - API integration
- [I18N_GUIDE.md](./I18N_GUIDE.md) - Internationalization setup

## Need Help?

If you encounter issues:
1. Check this guide's troubleshooting section
2. Verify file naming conventions
3. Check browser console for errors
4. Ensure both `page.tsx` and `route.ts` exist
5. Restart dev server after structural changes

---

**Version**: 2.0
**Last Updated**: 2025-12-09
**Next.js Compatibility**: App Router conventions
