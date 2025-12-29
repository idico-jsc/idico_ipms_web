import { useLocation, useNavigate } from "react-router";
import { MoreVertical } from "lucide-react";
import { cn } from "@/utils/cn";
import { useFilteredNavigation } from "../hooks/use-filtered-navigation";
import { useSidebar } from "@atoms/sidebar";
import type { NavItem } from "@/types/navigation.types";
import { getMobileNavItems } from "../utils/filter-nav-items";

/**
 * Mobile Bottom Navigation Component
 * Only visible on mobile devices
 * i18n support (labels pre-translated via useNavigationConfig hook)
 */
export function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { groups, footer } = useFilteredNavigation();
  const { toggleSidebar } = useSidebar();

  // Get items for mobile navigation (max 5)
  const mainItems = getMobileNavItems([...groups, ...footer], 5);

  const handleNavClick = (item: NavItem) => {
    if (item.path && item.path !== "#") {
      navigate(item.path);
    }
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden under the nav */}
      <div className="h-20 md:hidden" />

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden max-w-sm mx-auto"
        aria-label="Mobile bottom navigation"
      >
        {/* Glass background with blur effect */}
        <div className="mx-3 mb-3">
          <div
            className={cn(
              "relative overflow-visible rounded-lg",
              // Glassmorphism effect
              "bg-glass border",
              // Subtle gradient overlay
              "before:absolute before:inset-0 before:rounded-2xl before:overflow-hidden",
              "before:bg-gradient-to-t before:from-background/50 before:to-transparent",
              "before:pointer-events-none"
            )}
          >
            <div className="relative flex items-center justify-between p-2 gap-2">
              {/* Main navigation items */}
              {mainItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={cn(
                      "relative flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground",
                      "transition-all duration-200 aspect-square"
                    ,{
                      "text-primary-foreground": isActive,
                      "before:content-[''] before:absolute before:inset-0 before:rounded-sm before:transition-colors before:duration-200 before:pointer-events-none before:bg-primary":isActive
                    })}
                    aria-label={item.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {/* Active badge - appears above icon */}
                    {/* {isActive && item.label && (
                      <div
                        className={cn(
                          "absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap",
                          "rounded-full bg-primary px-3 py-1",
                          "text-xs font-medium text-primary-foreground",
                          "shadow-lg shadow-primary/20",
                          "animate-in fade-in slide-in-from-bottom-2 duration-200",
                          // Arrow pointing down
                          "after:absolute after:left-1/2 after:top-full after:-translate-x-1/2",
                          "after:border-4 after:border-transparent after:border-t-primary"
                        )}
                      >
                        {item.label}
                      </div>
                    )} */}

                    {/* Icon */}
                    {Icon && (
                      <Icon
                        className={cn(
                          "h-6 w-6 transition-all duration-200",
                          isActive && "scale-110"
                        )}
                        strokeWidth={isActive ? 2 : 1.5}
                        
                      />
                    )}
                  </button>
                );
              })}

              {/* Menu button (3 dots) */}
              <button
                onClick={toggleSidebar}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center py-2",
                  "text-muted-foreground transition-all duration-200",
                  "active:scale-95 hover:text-foreground"
                )}
                aria-label="Open menu"
              >
                <MoreVertical className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
