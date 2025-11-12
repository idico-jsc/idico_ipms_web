import { cleanPath, isAbsoluteURL } from "@/utils";
import { getToken } from "../features/auth/services/token-storage";
import { handleUnauthorized } from "../features/auth/helpers";

/**
 * API Client
 *
 * Unified API client that provides:
 * 1. Authenticated fetch wrapper with automatic token injection
 * 2. 401/403 response handling (auto-logout)
 * 3. SWR-compatible fetcher functions
 * 4. Mutation helpers (POST, PUT, DELETE)
 *
 * Server-side requirements for HttpOnly cookies:
 * - Server must set HttpOnly cookie named 'auth_token' (or custom name) on login
 * - Cookie should include: SameSite, Secure (for HTTPS), and appropriate expiry
 * - Cookie will be automatically sent with requests (no JS access needed)
 */

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com";

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Centralized API error handler
 * Handles common error scenarios and provides consistent error messages
 */
const handleApiError = async (response: Response): Promise<never> => {
  // Handle unauthorized responses
  if (response.status === 401 || response.status === 403) {
    handleUnauthorized();
    throw new Error("Unauthorized - You have been logged out");
  }

  // Try to parse error response
  let errorData: any;
  try {
    errorData = await response.json();
  } catch (e) {
    // If parsing fails, throw generic error with status
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  // Throw the parsed error data (Frappe format or custom format)
  throw errorData;
};

// ============================================================================
// Authenticated Fetch Wrapper
// ============================================================================

export type FetcherOptions = RequestInit & {
  requireAuth?: boolean;
};

const Fetcher = async (endpoint: string, options?: FetcherOptions) => {
  const url = isAbsoluteURL(endpoint) ? endpoint : cleanPath(`${API_BASE_URL}/${endpoint}`);
  const headers: HeadersInit = new Headers(options?.headers || {});
  const { requireAuth = true, ...fetchOptions } = options || {};

  // Inject auth token if required
  if (requireAuth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle error responses using centralized error handler
  if (!response.ok) {
    return handleApiError(response);
  }

  // Parse successful response
  const res = await response.json();
  return res;
};

const apiGet = async <T>(endpoint: string, options?: FetcherOptions): Promise<T> => {
  return Fetcher(endpoint, options) as Promise<T>;
};

const apiPost = async <T>(endpoint: string, body: any, options?: FetcherOptions): Promise<T> => {
  return Fetcher(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...options,
  }) as Promise<T>;
};

const apiPut = async <T>(endpoint: string, body: any, options?: FetcherOptions): Promise<T> => {
  return Fetcher(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...options,
  }) as Promise<T>;
};

const apiDelete = async <T>(endpoint: string, options?: FetcherOptions): Promise<T> => {
  return Fetcher(endpoint, {
    method: "DELETE",
    ...options,
  }) as Promise<T>;
};

const apiUpload = async <T>(
  endpoint: string,
  formData: FormData,
  options?: FetcherOptions,
): Promise<T> => {
  return Fetcher(endpoint, {
    method: "POST",
    body: formData,
    ...options,
  }) as Promise<T>;
};


export { apiGet, apiPost, apiPut, apiDelete, apiUpload };
