import type { FrappeAuthResponse } from "@/types/frappe.types";

/**
 * Re-export FrappeAuthResponse as AuthResponse for backward compatibility
 * This ensures consistent typing across the app
 */
export type AuthResponse = FrappeAuthResponse & {
  token: string; // Make token required for our login flow
};

/**
 * Login credentials payload
 */
export interface LoginCredentials {
  usr: string;
  pwd: string;
  use_jwt: 0 | 1;
}

/**
 * Frappe exception types
 */
export enum ExcType {
  InvalidCredentials = "AuthenticationError",
  SecurityException = "SecurityException",
}
