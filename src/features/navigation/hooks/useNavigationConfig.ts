/**
 * Navigation Config Hook
 *
 * Returns navigation configuration with i18n support
 * - Translates all menu labels using menu namespace
 * - Type-safe with NavigationConfig
 * - Automatically updates when language changes
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Home,
  LayoutDashboard,
  Users,
  Settings,
  Bell,
  BarChart,
  AlertCircle,
  Building2,
} from "lucide-react";
import type { NavigationConfig } from "@/types/navigation.types";

/**
 * Hook to get navigation config with translated labels
 */
export function useNavigationConfig(): NavigationConfig {
  const { t } = useTranslation("menu");

  return useMemo(
    () => ({
      groups: [
        // Main navigation - accessible to all users
        {
          id: "main",
          label: t("groups.main"),
          children: [
            {
              id: "home",
              label: t("items.home"),
              path: "/",
              icon: Home,
              showInMobileNav: true,
            },
            {
              id: "dashboard",
              label: t("items.dashboard"),
              path: "/dashboard",
              icon: LayoutDashboard,
              showInMobileNav: true,
              // No roles = visible to all authenticated users
            },
            {
              id: "customers",
              label: t("items.customers"),
              path: "/customers",
              icon: Building2,
              showInMobileNav: true,
            },
          ],
        },

        // Management - for admin users
        {
          id: "management",
          label: t("groups.management"),
          roles: ["System Manager", "Admin"],
          children: [
            {
              id: "users",
              label: t("items.users"),
              path: "/users",
              icon: Users,
              roles: ["System Manager"], // Only System Manager can see this
            },
            {
              id: "reports",
              label: t("items.reports"),
              path: "/reports",
              icon: BarChart,
              showInMobileNav: true,
              children: [
                {
                  id: "sales-report",
                  label: t("items.salesReport"),
                  path: "/reports/sales",
                },
                {
                  id: "user-report",
                  label: t("items.userReport"),
                  path: "/reports/users",
                },
              ],
            },
          ],
        },

        // System - for system administrators only
        {
          id: "system",
          label: t("groups.system"),
          roles: ["System Manager"],
          children: [
            {
              id: "settings",
              label: t("items.settings"),
              path: "/settings",
              icon: Settings,
            },
            {
              id: "debug-notifications",
              label: t("items.debugNotifications"),
              path: "/debug-notifications",
              icon: AlertCircle,
            },
          ],
        },
      ],

      // Footer items - always visible at bottom of sidebar
      footer: [
        {
          id: "notifications",
          label: t("items.notifications"),
          path: "/debug-notifications",
          icon: Bell,
          showInMobileNav: true,
        },
        {
          id: "settings-footer",
          label: t("items.settings"),
          path: "/settings",
          icon: Settings,
          showInMobileNav: true,
        },
      ],
    }),
    [t]
  );
}
