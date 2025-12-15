/**
 * Hook to get filtered navigation based on user roles
 *
 * Filters navigation groups and items based on current user's roles
 * Automatically removes empty groups after filtering
 * Uses i18n-enabled navigation config
 */

import { useMemo } from "react";
import { useUserRoles, hasAnyRole } from "@/features/auth";
import { useNavigationConfig } from "./useNavigationConfig";
import { filterNavItems } from "../utils/filter-nav-items";
import type { NavItem } from "@/types/navigation.types";

interface FilteredNavigation {
  groups: NavItem[];
  footer: NavItem[];
}

export function useFilteredNavigation(): FilteredNavigation {
  const userRoles = useUserRoles();
  const navigationConfig = useNavigationConfig();

  return useMemo(() => {
    // Filter groups based on group-level roles
    const filteredGroups = navigationConfig.groups
      .filter((group) => {
        // No roles required = visible to all
        if (!group.roles || group.roles.length === 0) return true;

        // Check if user has required roles for this group
        return hasAnyRole(userRoles, group.roles);
      })
      .map((group) => ({
        ...group,
        // Filter children within the group
        children: group.children ? filterNavItems(group.children, userRoles) : undefined,
      }))
      // Remove empty groups (groups with no visible children)
      .filter((group) => group.children && group.children.length > 0);

    // Filter footer items
    const filteredFooter = navigationConfig.footer
      ? filterNavItems(navigationConfig.footer, userRoles)
      : [];

    return {
      groups: filteredGroups,
      footer: filteredFooter,
    };
  }, [userRoles, navigationConfig]);
}
