/**
 * Home Page - CRM Dashboard
 *
 * Main dashboard page with:
 * - User greeting header
 * - Balance summary
 * - Quick actions
 * - Financial insights
 * - Recent activities
 */

import { Youtube, DollarSign, ShoppingCart, Zap } from 'lucide-react';
import {
  DashboardHeader,
  BalanceSummaryCard,
  InsightBanner,
  RecentActivitiesList,
  Activity,
} from '@/features/dashboard';
import { usePlatform } from '@/hooks/use-capacitor';
import { cn } from '@/utils';
import { LogoPath } from '@/components/atoms';

interface Props extends React.ComponentProps<'div'> { }

// Mock data - Replace with real API calls
const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Youtube',
    description: 'Subscription Payment',
    amount: 15.0,
    date: new Date('2024-05-16'),
    icon: <Youtube className="h-5 w-5" />,
    iconBgColor: 'bg-red-100 text-red-600',
    type: 'expense',
  },
  {
    id: '2',
    title: 'Stripe',
    description: 'Monthly Salary',
    amount: 3000.0,
    date: new Date('2024-05-15'),
    icon: <DollarSign className="h-5 w-5" />,
    iconBgColor: 'bg-blue-100 text-blue-600',
    type: 'income',
  },
  {
    id: '3',
    title: 'Google Play',
    description: 'E-book Purchase',
    amount: 139.0,
    date: new Date('2024-05-14'),
    icon: <ShoppingCart className="h-5 w-5" />,
    iconBgColor: 'bg-green-100 text-green-600',
    type: 'expense',
  },
  {
    id: '4',
    title: 'OVO',
    description: 'Top Up E-Money',
    amount: 180.0,
    date: new Date('2024-05-13'),
    icon: <Zap className="h-5 w-5" />,
    iconBgColor: 'bg-purple-100 text-purple-600',
    type: 'expense',
  },
];

export const Home = ({ ...rest }: Props) => {
  const { isNative } = usePlatform();

  const handleTransfer = () => {
    console.log('Transfer clicked');
  };

  const handleWithdraw = () => {
    console.log('Withdraw clicked');
  };

  const handleInvest = () => {
    console.log('Invest clicked');
  };

  const handleTopUp = () => {
    console.log('Top up clicked');
  };

  const handleInsightClick = () => {
    console.log('Insight banner clicked');
  };

  const handleActivityClick = (activity: Activity) => {
    console.log('Activity clicked:', activity);
  };

  return (
    <div
      className={cn(
        'min-h-screen -m-4 md:m-0',
        isNative && 'pt-safe'
      )}
      {...rest}
    >
      {/* Header Section - Only visible on mobile */}
      <div className="relative bg-brand-primary-dark px-4 pt-4 mb-4 pb-20 md:hidden">
        <DashboardHeader className="relative z-10" />
        <div className="absolute top-0 left-0 z-1 w-full h-full">
          <LogoPath variant="horizontal" className="absolute top-0 left-[-60%] w-full h-full [background:var(--brand-gradient-2)]" />
          <LogoPath
            variant="horizontal"
            className="absolute bottom-0 right-[-12%] w-full h-full rotate-180 [background:var(--brand-gradient-2)]"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container -mt-20 md:mt-0 mx-auto max-w-2xl px-4 pb-24 md:pb-8 md:pt-8 space-y-4">

        {/* Balance Summary Card */}
        <div className="-mt-6 md:mt-0">
          <BalanceSummaryCard
            balance={41379.0}
            currency="USD"
            onTransfer={handleTransfer}
            onWithdraw={handleWithdraw}
            onInvest={handleInvest}
            onTopUp={handleTopUp}
          />
        </div>

        {/* Insight Banner */}
        <InsightBanner
          title="Let's check your Financial"
          description="Insight for the month of June!"
          onClick={handleInsightClick}
        />

        {/* Recent Activities */}
        <RecentActivitiesList
          activities={mockActivities}
          onActivityClick={handleActivityClick}
        />
      </div>
    </div>
  );
};
