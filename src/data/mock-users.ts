/**
 * Mock User Data for Development
 *
 * IMPORTANT: This file contains mock authentication data for development only.
 * Remove this file and all references when deploying to production.
 */

import type { FrappeUser } from '@/types/frappe.types';

/**
 * Mock user credentials for testing
 * Email is used as the username for login
 */
export const MOCK_CREDENTIALS = {
  TENANT: {
    email: 'tenant@test.com',
    password: 'any', // Any password will work for mock users
  },
  STAFF: {
    email: 'staff@test.com',
    password: 'any',
  },
  ADMIN: {
    email: 'admin@test.com',
    password: 'any',
  },
} as const;

/**
 * Mock user profiles
 * These are returned after successful mock authentication
 */
export const MOCK_USERS: Record<string, FrappeUser> = {
  'tenant@test.com': {
    name: 'tenant@test.com',
    email: 'tenant@test.com',
    full_name: 'Nguyễn Văn Quang',
    user_image: undefined,
    user_type: 'Website User',
    roles: ['Customer', 'Tenant'],
    enabled: true,
    creation: '2024-01-01T00:00:00.000Z',
    modified: new Date().toISOString(),
  },
  'staff@test.com': {
    name: 'staff@test.com',
    email: 'staff@test.com',
    full_name: 'Trần Thị Linh',
    user_image: undefined,
    user_type: 'System User',
    roles: ['Staff', 'Employee'],
    enabled: true,
    creation: '2024-01-01T00:00:00.000Z',
    modified: new Date().toISOString(),
  },
  'admin@test.com': {
    name: 'admin@test.com',
    email: 'admin@test.com',
    full_name: 'Administrator',
    user_image: undefined,
    user_type: 'System User',
    roles: ['System Manager', 'Admin', 'Staff'],
    enabled: true,
    creation: '2024-01-01T00:00:00.000Z',
    modified: new Date().toISOString(),
  },
};

/**
 * Check if an email belongs to a mock user
 */
export function isMockUser(email: string): boolean {
  return email.toLowerCase() in MOCK_USERS;
}

/**
 * Get mock user data by email
 */
export function getMockUser(email: string): FrappeUser | null {
  const normalizedEmail = email.toLowerCase();
  return MOCK_USERS[normalizedEmail] || null;
}

/**
 * Generate a mock token for testing
 * Format: mock_token_{email}_{timestamp}
 */
export function generateMockToken(email: string): string {
  const timestamp = Date.now();
  return `mock_token_${email}_${timestamp}`;
}
