/**
 * Breadcrumb Component
 *
 * Displays navigation breadcrumbs based on current route
 * - Automatically generates breadcrumb trail from navigation config
 * - Supports i18n translations
 * - Mobile responsive
 */

import { useMemo } from "react";
import { useLocation, Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@atoms/breadcrumb";
import { useNavigationConfig } from "../hooks/use-navigation-config";
import type { NavItem } from "@/types/navigation.types";

interface BreadcrumbTrailItem {
  id: string;
  label: string;
  path?: string;
  isCurrentPage?: boolean;
}

/**
 * Find navigation item by path (recursive)
 */
function findNavItemByPath(
  items: NavItem[],
  targetPath: string,
  parents: NavItem[] = []
): { item: NavItem; trail: NavItem[] } | null {
  for (const item of items) {
    // Exact match
    if (item.path === targetPath) {
      return { item, trail: [...parents, item] };
    }

    // Check children
    if (item.children) {
      const found = findNavItemByPath(item.children, targetPath, [
        ...parents,
        item,
      ]);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Generate breadcrumb trail from navigation config
 */
function generateBreadcrumbTrail(
  pathname: string,
  navConfig: NavItem[]
): BreadcrumbTrailItem[] {
  // Always start with home
  const trail: BreadcrumbTrailItem[] = [
    {
      id: "home",
      label: "menu.home",
      path: "/",
    },
  ];

  // Home page - no additional breadcrumbs
  if (pathname === "/") {
    trail[0].isCurrentPage = true;
    return trail;
  }

  // Collect all nav items (flatten groups)
  const allItems: NavItem[] = [];
  navConfig.forEach((group) => {
    if (group.children) {
      allItems.push(...group.children);
    }
  });

  // Find matching nav item
  const found = findNavItemByPath(allItems, pathname);

  if (found) {
    // Add all items in the trail (skip home if already exists)
    found.trail.forEach((item, index) => {
      const isLast = index === found.trail.length - 1;
      trail.push({
        id: item.id,
        label: item.label,
        path: isLast ? undefined : item.path,
        isCurrentPage: isLast,
      });
    });
  } else {
    // Fallback: generate from pathname segments
    const segments = pathname.split("/").filter(Boolean);

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      const path = "/" + segments.slice(0, index + 1).join("/");

      // Format segment (capitalize and replace hyphens)
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      trail.push({
        id: segment,
        label: label,
        path: isLast ? undefined : path,
        isCurrentPage: isLast,
      });
    });
  }

  return trail;
}

export function Breadcrumb() {
  const location = useLocation();
  const { t } = useTranslation("menu");
  const navConfig = useNavigationConfig();

  const breadcrumbTrail = useMemo(() => {
    return generateBreadcrumbTrail(location.pathname, navConfig.groups);
  }, [location.pathname, navConfig.groups]);

  // Don't show breadcrumb on home page
  if (location.pathname === "/" || breadcrumbTrail.length <= 1) {
    return null;
  }

  return (
    <BreadcrumbRoot>
      <BreadcrumbList>
        {breadcrumbTrail.map((item, index) => {
          const isFirst = index === 0;
          const isLast = item.isCurrentPage;

          // Translate label using menu namespace
          // Use type assertion to handle dynamic translation keys
          const translatedLabel = t(item.label as never) as string;

          return (
            <>
              {index > 0 && (
                <BreadcrumbSeparator key={`separator-${item.id}`}>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}

              <BreadcrumbItem key={item.id}>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-2">
                    {isFirst ? (
                      <Home className="h-4 w-4" />
                    ) : (
                      <span className="max-w-[150px] truncate md:max-w-none">
                        {translatedLabel}
                      </span>
                    )}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      to={item.path || "/"}
                      className="flex items-center gap-2"
                    >
                      {isFirst ? (
                        <Home className="h-4 w-4" />
                      ) : (
                        <span className="max-w-[150px] truncate md:max-w-none">
                          {translatedLabel}
                        </span>
                      )}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}
