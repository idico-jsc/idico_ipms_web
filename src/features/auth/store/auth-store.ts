import { create } from "zustand";
import type { FrappeUser } from "@/types/frappe.types";
import { removeToken, hasToken, setToken } from "../services/token-storage";
import {
  getCurrentUser,
  loginWithCredentials,
  loginWithGoogle as loginWithGoogleApi,
  logout,
  resetPassword,
} from "../services/api";
import { getTokenExpirySeconds } from "../helpers";

/**
 * Auth Store State
 */
interface AuthState {
  // User data (stored in memory only, NOT persisted to localStorage)
  user: FrappeUser | null;

  // Loading states
  isLoading: boolean;
  isInitialized: boolean; // Track if initial auth check is done

  // Error handling
  error: string | null;

  // Computed
  isAuthenticated: boolean;
}

/**
 * Auth Store Actions
 */
interface AuthActions {
  // State setters
  setUser: (user: FrappeUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  clearAuth: () => void;

  // User profile fetching
  fetchUserProfile: () => Promise<void>;

  // Initialize auth on app load
  initialize: () => Promise<void>;
}

/**
 * Combined Auth Store Type
 */
type AuthStore = AuthState & AuthActions;

/**
 * Auth Store
 *
 * Global authentication state management with Zustand
 * - User data stored in MEMORY only (NOT persisted to localStorage)
 * - Token stored in cookies/localStorage for authentication
 * - On page load, if token exists, automatically fetch user profile
 * - Handles login/logout
 */
export const useAuthStore = create<AuthStore>()((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  isAuthenticated: false,

  // Setters
  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    });
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  // Initialize auth - check if token exists and fetch user
  initialize: async () => {
    // Skip if already initialized
    if (get().isInitialized) return;

    set({ isLoading: true });

    try {
      // Check if token exists
      if (hasToken()) {
        // Fetch user profile using existing token
        await get().fetchUserProfile();
      }
    } catch (err) {
      console.error("Failed to initialize auth:", err);
      // fetchUserProfile already handles clearing auth for 401/403 errors
      // Don't clear auth here for network errors - user can retry
      // This prevents logout on rapid refreshes or temporary network issues
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  // Login action
  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      // Call login API
      const data = await loginWithCredentials(username, password);
      console.log("data", data);

      if (!data.token) {
        throw new Error("No token received");
      }
      // Save token
      const expiresIn = getTokenExpirySeconds();
      setToken(data.token, expiresIn);
      // Fetch user profile
      await get().fetchUserProfile();

      set({ isLoading: false, error: null });
    } catch (err) {
      console.log("err", err);

      const errorMessage = err instanceof Error ? err.message : "Login failed";
      set({
        isLoading: false,
        error: errorMessage,
        user: null,
        isAuthenticated: false,
      });
      throw err;
    }
  },

  // Login with Google OAuth
  loginWithGoogle: async (idToken: string) => {
    set({ isLoading: true, error: null });

    try {
      // Call Google login API with ID token (JWT credential)
      const data = await loginWithGoogleApi(idToken);
      if (!data.token) {
        throw new Error("No token received from Google login");
      }
      // Save token
      const expiresIn = getTokenExpirySeconds();
      setToken(data.token, expiresIn);
      // Fetch user profile
      await get().fetchUserProfile();

      set({ isLoading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Google login failed";
      set({
        isLoading: false,
        error: errorMessage,
        user: null,
        isAuthenticated: false,
      });
      throw err;
    }
  },

  // Logout action
  logout: async () => {
    try {
      // Call logout API (best effort - don't fail if it errors)
      await logout();
    } catch (err) {
      console.error("Logout API call failed:", err);
      // Continue with local cleanup even if API fails
    } finally {
      // Always clear token and state
      removeToken();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    }
  },

  // Clear auth state (without redirect)
  clearAuth: () => {
    removeToken();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  },

  // Fetch user profile
  fetchUserProfile: async () => {
    try {
      // Call get current user API
      const user = await getCurrentUser();

      // Store user data in memory only
      if (user) {
        set({
          user: user,
          isAuthenticated: true,
          error: null,
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);

      // Don't clear auth here - the API client's handleApiError already
      // calls handleUnauthorized() for 401/403 errors
      // For network errors, keep the token so user can retry
      // This prevents logout on rapid page refreshes

      throw err;
    }
  },
}));

/**
 * Selector hooks for specific state slices
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
