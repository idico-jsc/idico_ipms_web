/**
 * Balance Summary Card Component
 *
 * Displays account balance summary with quick action buttons
 * - Balance amount
 * - Quick action buttons (Transfer, Withdraw, Invest, Top up)
 */

import { ArrowDownLeft, ArrowUpRight, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent } from '@atoms/card';
import { cn } from '@/utils';

interface BalanceSummaryCardProps {
  balance: number;
  currency?: string;
  className?: string;
  onTransfer?: () => void;
  onWithdraw?: () => void;
  onInvest?: () => void;
  onTopUp?: () => void;
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary';
}

function QuickActionButton({ icon, label, onClick, variant = 'default' }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 p-2 rounded-xl transition-colors',
        'hover:bg-primary/5 active:scale-95'
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-full',
          variant === 'primary'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        {icon}
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </button>
  );
}

export function BalanceSummaryCard({
  balance,
  currency = 'USD',
  className,
  onTransfer,
  onWithdraw,
  onInvest,
  onTopUp,
}: BalanceSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card className={cn('bg-background shadow-sm', className)}>
      <CardContent className="p-6 space-y-6">
        {/* Balance Section */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Your Balance
          </p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold text-foreground">
              {formatCurrency(balance)}
            </h2>
            <div className="flex items-center gap-1 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+2.5%</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          <QuickActionButton
            icon={<ArrowUpRight className="h-5 w-5" />}
            label="Transfer"
            onClick={onTransfer}
            variant="primary"
          />
          <QuickActionButton
            icon={<ArrowDownLeft className="h-5 w-5" />}
            label="Withdraw"
            onClick={onWithdraw}
          />
          <QuickActionButton
            icon={<TrendingUp className="h-5 w-5" />}
            label="Invest"
            onClick={onInvest}
          />
          <QuickActionButton
            icon={<Plus className="h-5 w-5" />}
            label="Top up"
            onClick={onTopUp}
          />
        </div>
      </CardContent>
    </Card>
  );
}
