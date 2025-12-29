/**
 * Sidebar Layout Template
 *
 * Reusable layout with sidebar and header
 * - Sidebar navigation with collapse/expand
 * - Header with glass morphism effect
 * - Responsive content area
 * - Native app padding support
 */

import { ReactNode } from "react";
import { AppSidebar, Header, MobileBottomNav, MobileTopBar } from "@/features/navigation";
import { usePlatform } from "@/hooks/use-capacitor";

interface SidebarLayoutProps {
  children: ReactNode;
}

/**
 * Sidebar Layout Template
 * Wraps content with sidebar and header
 */
export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isNative } = usePlatform();

  return (
    <AppSidebar>
      <div className="flex w-full flex-col">
        {/* Desktop Header with sidebar trigger */}
        <Header />
        {/* Mobile Top Bar */}
        <MobileTopBar />
        {/* Main content */}
        <div
          className="container mx-auto w-full flex-1 p-4"
          style={
            isNative
              ? {
                  paddingTop: "0.5rem",
                }
              : undefined
          }
        >
          {children}
        </div>
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </AppSidebar>
  );
}
