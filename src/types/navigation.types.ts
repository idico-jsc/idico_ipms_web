/**
 * Navigation Types for Role-Based Sidebar
 *
 * Type-safe definitions for the navigation system
 */

import { LucideIcon } from "lucide-react";

/**
 * Navigation item - represents a menu link or a group of links
 *
 * Can be used in two ways:
 * 1. As a single menu item (has `path`, optional `children` for sub-menu)
 * 2. As a group container (has `children` as group items, no `path`)
 */
export interface NavItem {
  /** Unique identifier for the nav item */
  id: string;

  /** Display label (can be i18n key) */
  label: string;

  /** Route path (e.g., '/dashboard') - required for menu items, omit for groups */
  path?: string;

  /** Icon component from lucide-react */
  icon?: LucideIcon;

  /** Roles required to see this item (empty = visible to all) */
  roles?: string[];

  /** Badge text (e.g., "New", "3") */
  badge?: string;

  /** Tooltip text for collapsed sidebar */
  tooltip?: string;

  /** Nested items (for sub-menus or group containers) */
  children?: NavItem[];

  /** Whether group is initially collapsed */
  defaultCollapsed?: boolean;

  /** Show this item in mobile bottom navigation (max 5 items) */
  showInMobileNav?: boolean;
}

/**
 * Complete navigation configuration
 */
export interface NavigationConfig {
  /** Main navigation groups */
  groups: NavItem[];

  /** Footer navigation items (e.g., Settings, Logout) */
  footer?: NavItem[];
}

/**
 * Permission check result
 */
export interface PermissionCheck {
  /** Whether user has required permissions */
  hasPermission: boolean;

  /** Missing roles (for debugging) */
  missingRoles?: string[];
}
