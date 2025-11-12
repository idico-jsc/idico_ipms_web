import { createBrowserRouter, RouteObject } from 'react-router';
import ErrorBoundary from './error';
import RootLayout from './layout';
import NotFoundPage from './not-found';

/**
 * Next.js-style App Router for React
 *
 * File-based routing conventions:
 * - Folders define URL segments
 * - page.tsx makes a route publicly accessible
 * - layout.tsx provides shared UI that wraps child segments
 * - Layouts cascade automatically (nested layouts wrap inner layouts)
 * - (folder) = Route groups - excluded from URL path (for organization)
 * - _folder = Private folders - excluded from routing entirely
 */

// Auto-discover all page.tsx files
const pageModules = import.meta.glob<{ default: React.ComponentType }>(
  './**/page.tsx',
  { eager: true }
);

// Auto-discover all layout.tsx files
const layoutModules = import.meta.glob<{ default: React.ComponentType<{ children: React.ReactNode }> }>(
  './**/layout.tsx',
  { eager: true }
);

// Auto-discover all error.tsx files
const errorModules = import.meta.glob<{ default: React.ComponentType }>(
  './**/error.tsx',
  { eager: true }
);

interface RouteConfig {
  path: string;
  Component: React.ComponentType;
  layouts: Array<React.ComponentType<{ children: React.ReactNode }>>;
  hasError: boolean;
  filePath: string;
}

/**
 * Convert file path to URL path
 * Example: ./about/page.tsx -> /about
 * Example: ./page.tsx -> /
 * Example: ./(auth)/login/page.tsx -> /login (route groups excluded)
 * Example: ./auth/login/page.tsx -> /auth/login
 */
function filePathToRoute(filePath: string): string {
  // Remove leading './' and trailing '/page.tsx'
  let path = filePath.replace(/^\.\//, '').replace(/\/page\.tsx$/, '');

  // Remove route groups (folders wrapped in parentheses)
  // Example: (auth)/login -> login
  path = path.replace(/\([^)]+\)\/?/g, '');

  // Remove private folders (folders starting with underscore)
  // Example: _components/button -> (excluded entirely, but shouldn't have page.tsx)
  path = path.replace(/\/?_[^/]+\/?/g, '');

  // Root page
  if (path === '') return '/';

  // Convert to URL path
  return `/${path}`;
}

/**
 * Get all layouts for a route path (in order from root to leaf)
 * Example: ./(auth)/login/page.tsx -> [RootLayout, AuthLayout]
 * Note: Uses original file path to find layouts (including route groups)
 */
function getLayoutsForPath(filePath: string): Array<React.ComponentType<{ children: React.ReactNode }>> {
  const layouts: Array<React.ComponentType<{ children: React.ReactNode }>> = [];

  // Always start with root layout
  layouts.push(RootLayout);

  // Remove './' prefix and '/page.tsx' suffix to get the folder path
  let path = filePath.replace(/^\.\//, '').replace(/\/page\.tsx$/, '');

  // If empty (root page), no additional layouts
  if (path === '') return layouts;

  // Split into segments (including route groups like (auth))
  const segments = path.split('/');

  // Check for layout at each level
  let currentPath = '.';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const layoutPath = `${currentPath}/layout.tsx`;

    if (layoutModules[layoutPath]) {
      layouts.push(layoutModules[layoutPath].default);
    }
  }

  return layouts;
}

/**
 * Check if a route has an error boundary
 * Note: Uses original file path to find error boundaries (including route groups)
 */
function hasErrorBoundary(filePath: string): boolean {
  // Check root error first - if it exists, ALL routes have error boundary
  if (errorModules['./error.tsx']) {
    return true;
  }

  // Remove './' prefix and '/page.tsx' suffix
  let path = filePath.replace(/^\.\//, '').replace(/\/page\.tsx$/, '');

  // If empty (root page) and no root error, no error boundary
  if (path === '') return false;

  // Split into segments
  const segments = path.split('/');
  let currentPath = '.';

  // Check for error.tsx at each level
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const errorPath = `${currentPath}/error.tsx`;

    if (errorModules[errorPath]) {
      return true;
    }
  }

  return false;
}

// Build routes from discovered pages
const routes: RouteConfig[] = Object.entries(pageModules).map(([filePath, module]) => {
  const path = filePathToRoute(filePath);
  const layouts = getLayoutsForPath(filePath);
  const hasError = hasErrorBoundary(filePath);

  return {
    path,
    Component: module.default,
    layouts,
    hasError,
    filePath,
  };
});

// Sort routes to ensure catch-all routes are last
const sortedRoutes = routes.sort((a, b) => {
  if (a.path === '*' || a.path.includes('*')) return 1;
  if (b.path === '*' || b.path.includes('*')) return -1;
  return 0;
});

/**
 * Convert RouteConfig array to React Router route objects
 * Wraps each page component with its layouts and error boundary
 */
function buildRouteObjects(routes: RouteConfig[]): RouteObject[] {
  return routes.map((route) => {
    const { path, Component, layouts } = route;

    // Build nested layout structure
    // Start from the innermost (the page component)
    let element: React.ReactNode = <Component />;

    // Wrap with layouts from innermost to outermost (reverse order)
    for (let i = layouts.length - 1; i >= 0; i--) {
      const Layout = layouts[i];
      element = <Layout>{element}</Layout>;
    }

    return {
      path,
      element,
      errorElement: <ErrorBoundary />,
    };
  });
}

// Build route objects
const routeObjects = buildRouteObjects(sortedRoutes);

// Add catch-all 404 route
routeObjects.push({
  path: '*',
  element: <NotFoundPage />,
});

/**
 * Create the browser router with all discovered routes
 * Uses createBrowserRouter to enable data router features
 */
export const router = createBrowserRouter(routeObjects);
