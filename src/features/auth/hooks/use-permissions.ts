/**
 * Permission Hooks
 *
 * React hooks for role-based access control
 * Integrates with Zustand auth store
 */

import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { checkUserPermission, getAllUserRoles } from "../utils/permissions";

/**
 * Check if current user has required role(s)
 *
 * @param requiredRoles - Array of roles (user needs at least one)
 * @returns true if user has permission
 *
 * @example
 * ```tsx
 * const canViewAdmin = useHasRole(['System Manager', 'Admin']);
 * if (!canViewAdmin) return null;
 * ```
 */
export function useHasRole(requiredRoles?: string[]): boolean {
  const user = useAuthStore((state) => state.user);

  return useMemo(() => {
    return checkUserPermission(user, requiredRoles);
  }, [user, requiredRoles]);
}

/**
 * Get all roles for current user
 * Combines user.roles and user.assigned_sis_roles
 *
 * @returns Array of all user roles
 *
 * @example
 * ```tsx
 * const roles = useUserRoles();
 * console.log(roles); // ['Admin', 'Teacher', 'Parent']
 * ```
 */
export function useUserRoles(): string[] {
  const user = useAuthStore((state) => state.user);

  return useMemo(() => {
    return getAllUserRoles(user);
  }, [user]);
}

/**
 * Check multiple permission sets
 * Useful for complex permission logic
 *
 * @param permissionSets - Object with permission checks
 * @returns Object with boolean results
 *
 * @example
 * ```tsx
 * const permissions = usePermissions({
 *   canEdit: ['Editor', 'Admin'],
 *   canDelete: ['Admin'],
 *   canView: ['Viewer', 'Editor', 'Admin'],
 * });
 *
 * if (permissions.canEdit) { ... }
 * ```
 */
export function usePermissions(
  permissionSets: Record<string, string[] | undefined>
): Record<string, boolean> {
  const user = useAuthStore((state) => state.user);

  return useMemo(() => {
    const results: Record<string, boolean> = {};

    for (const [key, roles] of Object.entries(permissionSets)) {
      results[key] = checkUserPermission(user, roles);
    }

    return results;
  }, [user, permissionSets]);
}
