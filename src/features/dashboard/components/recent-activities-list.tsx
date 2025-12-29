/**
 * Recent Activities List Component
 *
 * Displays list of recent transactions/activities
 * - Activity icon
 * - Title and description
 * - Amount and date
 */

import { Card } from '@atoms/card';
import { Avatar, AvatarFallback } from '@atoms/avatar';
import { cn } from '@/utils';

export interface Activity {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: Date;
  icon?: React.ReactNode;
  iconBgColor?: string;
  type: 'income' | 'expense';
}

interface RecentActivitiesListProps {
  activities: Activity[];
  className?: string;
  onActivityClick?: (activity: Activity) => void;
}

interface ActivityItemProps {
  activity: Activity;
  onClick?: () => void;
}

function ActivityItem({ activity, onClick }: ActivityItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const isPositive = activity.type === 'income';

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg transition-colors',
        onClick && 'cursor-pointer hover:bg-accent'
      )}
      onClick={onClick}
    >
      {/* Icon */}
      <Avatar className={cn('h-11 w-11', activity.iconBgColor || 'bg-primary/10')}>
        <AvatarFallback className={cn('bg-transparent', activity.iconBgColor || 'text-primary')}>
          {activity.icon}
        </AvatarFallback>
      </Avatar>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{activity.title}</p>
        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
      </div>

      {/* Amount & Date */}
      <div className="flex flex-col items-end gap-0.5">
        <span
          className={cn(
            'text-sm font-semibold',
            isPositive ? 'text-emerald-600' : 'text-foreground'
          )}
        >
          {isPositive ? '+' : '-'}
          {formatCurrency(activity.amount)}
        </span>
        <span className="text-xs text-muted-foreground">{formatDate(activity.date)}</span>
      </div>
    </div>
  );
}

export function RecentActivitiesList({
  activities,
  className,
  onActivityClick,
}: RecentActivitiesListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground px-1">Recent Transactions</h3>

      {/* Activities List */}
      <Card className="bg-background shadow-sm">
        <div className="divide-y divide-border">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onClick={() => onActivityClick?.(activity)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No recent activities
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
