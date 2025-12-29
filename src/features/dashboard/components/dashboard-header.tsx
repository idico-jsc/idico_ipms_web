/**
 * Dashboard Header Component
 *
 * Header for dashboard with user greeting and notification
 * - Avatar display
 * - Greeting message
 * - Notification bell icon
 */

import { Bell } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { UserAvatar } from '@/components/molecules/user-avatar';
import { useAuth } from '@/features/auth';
import { useNavigate } from 'react-router';
import { cn } from '@/utils';
import { ThemeToggle } from '@/features/preference';

interface DashboardHeaderProps {
  className?: string;
}

export function DashboardHeader({ className }: DashboardHeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleNotificationClick = () => {
    navigate('/debug-notifications');
  };

  return (
    <div className={cn('flex items-center justify-between my-2', className)}>
      {/* Left: Avatar + Greeting */}
      <div className="flex items-center gap-3">
        <UserAvatar
          name={user?.full_name || 'User'}
          imageUrl={user?.user_image}
          size="lg"

        />
        <div className="flex flex-col">
          <span className="text-sm font-light text-primary-foreground/80">
            {getGreeting()}!
          </span>
          <span className="text-base font-medium text-primary-foreground">
            {user?.full_name || 'Welcome back'}
          </span>
        </div>
      </div>

      {/* Right: Notification */}
      <div className="flex gap-1 items-center">
        <ThemeToggle className="text-primary-foreground bg-white/5" />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotificationClick}
          className="relative bg-white/5 rounded-full h-10 w-10 text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Bell className="h-5 w-5" />
          {/* Notification badge */}
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </Button>
      </div>
    </div>
  );
}
