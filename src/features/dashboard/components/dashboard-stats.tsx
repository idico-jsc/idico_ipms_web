import { Button } from '@/components/atoms/button';

interface Stat {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
}

interface DashboardStatsProps {
  stats: Stat[];
  onRefresh?: () => void;
}

export function DashboardStats({ stats, onRefresh }: DashboardStatsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Statistics</h2>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Refresh
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-white dark:bg-gray-800"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
            {stat.change && (
              <p
                className={`text-sm mt-1 ${
                  stat.trend === 'up'
                    ? 'text-green-600'
                    : stat.trend === 'down'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
