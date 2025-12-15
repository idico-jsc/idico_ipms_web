/**
 * Navigation filtering utilities
 *
 * Helper functions to filter navigation items based on user roles
 */

import { hasAnyRole } from "@/features/auth";
import type { NavItem } from "@/types/navigation.types";

/**
 * Recursively filter navigation items based on user roles
 *
 * @param items - Array of navigation items to filter
 * @param userRoles - Array of user's roles
 * @returns Filtered array of navigation items
 *
 * @example
 * ```ts
 * const userRoles = ['Teacher', 'Parent'];
 * const filteredItems = filterNavItems(allItems, userRoles);
 * // Only returns items where user has required roles
 * ```
 */
export function filterNavItems(items: NavItem[], userRoles: string[]): NavItem[] {
  return items
    .filter((item) => {
      // No roles required = visible to all
      if (!item.roles || item.roles.length === 0) return true;

      // Check if user has at least one required role
      return hasAnyRole(userRoles, item.roles);
    })
    .map((item) => ({
      ...item,
      // Recursively filter children
      children: item.children ? filterNavItems(item.children, userRoles) : undefined,
    }));
}

/**
 * Get items marked for mobile navigation from groups and footer
 *
 * @param items - Navigation items (can be groups with children or individual items)
 * @param maxItems - Maximum number of items to return (default: 5)
 * @returns Filtered array of navigation items for mobile nav
 */
export function getMobileNavItems(
  items: NavItem[],
  maxItems: number = 5
): NavItem[] {
  const allItems: NavItem[] = [];

  // Collect all items from groups and footer
  items.forEach((item) => {
    if (item.children && item.children.length > 0 && !item.path) {
      // It's a group - add its children
      allItems.push(...item.children);
    } else {
      // It's a single item - add it directly
      allItems.push(item);
    }
  });

  // Filter items marked for mobile navigation and take max items
  return allItems
    .filter((item) => item.showInMobileNav === true)
    .slice(0, maxItems);
}
