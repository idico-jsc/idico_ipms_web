/**
 * Permission Utilities
 *
 * Helper functions for role-based access control
 * Works with user.roles and user.assigned_sis_roles
 */

import type { FrappeUser } from "@/types/frappe.types";

/**
 * Check if user has at least one of the required roles
 *
 * @param userRoles - Roles from user object (user.roles or user.assigned_sis_roles)
 * @param requiredRoles - Roles required for access (empty = public)
 * @returns true if user has permission
 *
 * @example
 * ```ts
 * const canView = hasAnyRole(['Teacher', 'Parent'], ['Admin', 'Teacher']); // true
 * const canEdit = hasAnyRole(['Parent'], ['Admin', 'Teacher']); // false
 * ```
 */
export function hasAnyRole(
  userRoles: string[] | undefined,
  requiredRoles: string[] | undefined
): boolean {
  // No roles required = public access
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // No user roles = no access to protected items
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  // Check if user has at least one required role
  return requiredRoles.some((role) => userRoles.includes(role));
}

/**
 * Check if user has ALL required roles
 *
 * @param userRoles - Roles from user object
 * @param requiredRoles - All roles required
 * @returns true if user has all roles
 *
 * @example
 * ```ts
 * const hasAll = hasAllRoles(['Admin', 'Teacher'], ['Admin', 'Teacher']); // true
 * const missing = hasAllRoles(['Admin'], ['Admin', 'Teacher']); // false
 * ```
 */
export function hasAllRoles(
  userRoles: string[] | undefined,
  requiredRoles: string[] | undefined
): boolean {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  return requiredRoles.every((role) => userRoles.includes(role));
}

/**
 * Get all user roles (combines user.roles and user.assigned_sis_roles)
 *
 * @param user - Frappe user object
 * @returns Combined array of all roles (no duplicates)
 *
 * @example
 * ```ts
 * const user = { roles: ['Admin', 'Teacher'], assigned_sis_roles: ['Teacher', 'Parent'] };
 * const allRoles = getAllUserRoles(user); // ['Admin', 'Teacher', 'Parent']
 * ```
 */
export function getAllUserRoles(user: FrappeUser | null): string[] {
  if (!user) return [];

  const roles = new Set<string>();

  // Add from user.roles
  if (user.roles) {
    user.roles.forEach((role) => roles.add(role));
  }

  // Add from user.assigned_sis_roles
  if (user.assigned_sis_roles) {
    user.assigned_sis_roles.forEach((role) => roles.add(role));
  }

  return Array.from(roles);
}

/**
 * Check user permission against required roles
 * Uses BOTH user.roles and user.assigned_sis_roles
 *
 * @param user - Current user
 * @param requiredRoles - Roles needed for access
 * @returns true if user has permission
 *
 * @example
 * ```ts
 * const user = { roles: ['Teacher'], assigned_sis_roles: ['Parent'] };
 * const canView = checkUserPermission(user, ['Admin', 'Teacher']); // true
 * const canEdit = checkUserPermission(user, ['Admin']); // false
 * const publicAccess = checkUserPermission(user, []); // true
 * ```
 */
export function checkUserPermission(
  user: FrappeUser | null,
  requiredRoles: string[] | undefined
): boolean {
  const allRoles = getAllUserRoles(user);
  return hasAnyRole(allRoles, requiredRoles);
}
