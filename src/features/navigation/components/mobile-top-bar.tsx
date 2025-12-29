/**
 * Mobile Top Bar Component
 *
 * Top navigation bar for mobile devices
 * - Back button navigation
 * - Page title from current route
 * - Quick actions (notifications, user menu)
 * - Glass morphism design
 * - Safe area support for native apps
 */

import { useLocation, useNavigate } from 'react-router';
import { Bell, ChevronLeft, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';
import { usePlatform } from '@/hooks/use-capacitor';
import { Button } from '@/components/atoms/button';
import { usePageTitle } from '../hooks';

/**
 * Mobile Top Bar Component
 * Only visible on mobile devices (not on home page)
 */
export function MobileTopBar() {
  const location = useLocation();
  const { isNative } = usePlatform();
  const navigate = useNavigate();
  const pageTitle = usePageTitle();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  // Hide on home page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-background md:hidden',
        ' overflow-hidden',
        // Add safe area padding for native apps
        isNative && 'pt-safe'
      )}
    >
      <div className="relative z-10 flex h-14 items-center justify-between px-4">
        {/* Left: Back Button + Title */}
        <div className="flex items-center flex-1">
          <Button
            variant="ghost"
          
            onClick={handleBack}
            className="p-0 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
            <h1 className="text-lg font-semibold truncate">{pageTitle}</h1>
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            // onClick={handleNotificationClick}
            className="relative rounded-full h-10 w-10 "
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettings}
            className="relative rounded-full h-10 w-10  hover:bg-primary-foreground/10"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
