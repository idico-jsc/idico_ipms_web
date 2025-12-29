/**
 * Insight Banner Component
 *
 * Promotional banner for insights and reports
 * - Icon/Image
 * - Message text
 * - Navigation arrow
 */

import { ChevronRight, TrendingUp } from 'lucide-react';
import { Card } from '@atoms/card';
import { Avatar, AvatarFallback } from '@atoms/avatar';
import { cn } from '@/utils';

interface InsightBannerProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function InsightBanner({
  title = "Let's check your Financial",
  description = 'Insight for the month of June!',
  icon,
  onClick,
  className,
}: InsightBannerProps) {
  return (
    <Card
      className={cn(
        'bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 cursor-pointer',
        'hover:shadow-md transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between p-4">
        {/* Left: Icon + Text */}
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          <Avatar className="h-12 w-12 bg-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {icon || <TrendingUp className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>

          {/* Text */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{title}</span>
            <span className="text-sm text-muted-foreground">{description}</span>
          </div>
        </div>

        {/* Right: Arrow */}
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      </div>
    </Card>
  );
}
