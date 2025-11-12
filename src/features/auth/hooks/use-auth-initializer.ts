import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/auth-store';

/**
 * Auth Initializer Hook
 *
 * Automatically initializes authentication on app mount by:
 * 1. Checking if a valid token exists
 * 2. Fetching user profile if token is found
 * 3. Setting isInitialized flag
 *
 * Features:
 * - Runs only once per component lifecycle
 * - Safe for React 18 StrictMode (double mount protection)
 * - Prevents race conditions on rapid page refreshes
 *
 * Usage:
 * ```tsx
 * // In App.tsx or a provider component
 * function App() {
 *   useAuthInitializer();
 *   return <YourApp />;
 * }
 * ```
 */
export function useAuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in StrictMode or on rapid refreshes
    // Check both ref (component-level) and store state (global-level)
    if (hasInitialized.current || isInitialized) {
      return;
    }

    hasInitialized.current = true;

    // Initialize auth - this handles errors internally and doesn't throw
    initialize().catch((error) => {
      console.error("Auth initialization failed:", error);
    });
  }, []); // Empty deps - only run once on mount
}
