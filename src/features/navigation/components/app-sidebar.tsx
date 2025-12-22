/**
 * Application Sidebar
 *
 * Main sidebar component with role-based navigation
 * - Filters navigation items based on user roles
 * - Supports nested/grouped menu items
 * - Responsive: Desktop sidebar / Mobile drawer
 * - Active route highlighting
 * - Self-contained with SidebarProvider
 * - i18n support (labels pre-translated via useNavigationConfig hook)
 */

import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router";
import { ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/atoms/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/atoms/collapsible";
import { useFilteredNavigation } from "../hooks/use-filtered-navigation";
import type { NavItem } from "@/types/navigation.types";
import { Logo, LogoPath } from "@atoms";

interface AppSidebarProps {
  children: ReactNode;
}

/**
 * Render a single navigation item
 * Handles both simple links and nested children
 * Labels are already translated via useNavigationConfig hook
 */
function NavItemRenderer({ item }: { item: NavItem }) {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  const Icon = item.icon;

  // Case 1: Has children - render collapsible menu
  if (item.children && item.children.length > 0) {
    // Check if any child is currently active to default expand the menu
    const hasActiveChild = item.children.some(
      (child) => location.pathname === child.path
    );

    return (
      <Collapsible
        defaultOpen={hasActiveChild}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.label} isActive={isActive}>
              {Icon && <Icon />}
              <span>{item.label}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => {
                const isChildActive = location.pathname === child.path;
                const ChildIcon = child.icon;

                return (
                  <SidebarMenuSubItem key={child.id}>
                    <SidebarMenuSubButton asChild isActive={isChildActive}>
                      <NavLink to={child.path??""}>
                        {ChildIcon && <ChildIcon />}
                        <span>{child.label}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // Case 2: No children - simple link
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.label} isActive={isActive}>
        <NavLink to={item.path??""}>
          {Icon && <Icon />}
          <span>{item.label}</span>
          {item.badge && (
            <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs">
              {item.badge}
            </span>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/**
 * Main Application Sidebar Component
 * Wraps sidebar with provider and accepts children as content
 */
export function AppSidebar({ children }: AppSidebarProps) {

  const { groups, footer } = useFilteredNavigation();

  return (
    <SidebarProvider>
      <Sidebar className="bg-brand-primary overflow-hidden" collapsible="icon">
       <div className="flex flex-col relative w-full h-full z-20 ">
         {/* Header */}
        <SidebarHeader>
          <div className="flex items-center py-2 gap-2">
            {/* Logo Icon - Only visible when collapsed */}
            <div className="transition-all duration-200 opacity-0 w-0 group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:w-auto">
              <div className="flex h-8 w-8 p-1.5 items-center justify-center rounded-md bg-brand-secondary text-primary-foreground">
                <Logo variant={"icon"} className="brightness-0 invert"/>
              </div>
            </div>

            {/* Logo Text - Only visible when expanded */}
            <div className="transition-all duration-200 opacity-100 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0">
              <Logo variant={"white"} />
            </div>
          </div>
        </SidebarHeader>

        {/* Main Navigation */}
        <SidebarContent>
          {groups.map((group) => (
            <SidebarGroup key={group.id}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.children?.map((item) => (
                    <NavItemRenderer key={item.id} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* Footer */}
        {footer.length > 0 && (
          <SidebarFooter>
            <SidebarMenu>
              {footer.map((item) => (
                <NavItemRenderer key={item.id} item={item} />
              ))}
            </SidebarMenu>
          </SidebarFooter>
        )}
       </div>
       {/*Decor */}
        <div className="absolute top-0 left-0 z-1 min-w-75 w-full h-full">
          <LogoPath className="absolute top-0 left-0 w-full h-[52.5%] bg-brand-primary"/>
          <LogoPath className="absolute bottom-0 left-0 w-full h-[52.5%] rotate-180 bg-brand-primary"/>
        </div>
      </Sidebar>

      {/* Children rendered in SidebarInset */}
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
