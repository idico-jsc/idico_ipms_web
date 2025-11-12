/**
 * Frappe Constants
 *
 * Constants for Frappe API integration
 */

/**
 * Storage Keys
 */
export const FRAPPE_STORAGE_KEYS = {
  TOKEN: 'frappe_bearer_token',
  TOKEN_EXPIRY: 'frappe_token_expiry',
  USER: 'frappe_user',
} as const;

/**
 * API Endpoints
 */
export const FRAPPE_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/method/login',
    LOGOUT: '/api/method/logout',
    GET_LOGGED_USER: '/api/method/frappe.auth.get_logged_user',
  },
  RESOURCE: '/api/resource',
  METHOD: '/api/method',
  FILE: '/api/method/upload_file',
} as const;

/**
 * Common Doctypes
 */
export const FRAPPE_DOCTYPES = {
  USER: 'User',
  FILE: 'File',
  COMMENT: 'Comment',
  TAG: 'Tag',
  VERSION: 'Version',
} as const;

/**
 * Document Status
 */
export const FRAPPE_DOC_STATUS = {
  DRAFT: 0,
  SUBMITTED: 1,
  CANCELLED: 2,
} as const;

/**
 * User Types
 */
export const FRAPPE_USER_TYPES = {
  SYSTEM: 'System User',
  WEBSITE: 'Website User',
} as const;

/**
 * HTTP Methods
 */
export const FRAPPE_HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

/**
 * Token Types
 */
export const FRAPPE_TOKEN_TYPES = {
  BEARER: 'Bearer',
  TOKEN: 'token',
} as const;

/**
 * Default Configuration
 */
export const FRAPPE_DEFAULT_CONFIG = {
  TOKEN_TYPE: FRAPPE_TOKEN_TYPES.BEARER,
  PAGE_LENGTH: 20,
  MAX_PAGE_LENGTH: 500,
} as const;

/**
 * Error Messages
 */
export const FRAPPE_ERROR_MESSAGES = {
  NO_TOKEN: 'No authentication token found',
  TOKEN_EXPIRED: 'Authentication token has expired',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  SERVER_ERROR: 'Server error occurred',
  NETWORK_ERROR: 'Network error occurred',
  INVALID_RESPONSE: 'Invalid response from server',
} as const;

/**
 * Environment Variables
 */
export const FRAPPE_ENV = {
  URL: import.meta.env.VITE_FRAPPE_URL || '',
  USE_TOKEN: import.meta.env.VITE_FRAPPE_USE_TOKEN === 'true',
} as const;
