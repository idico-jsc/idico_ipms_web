import { HTMLAttributes, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import type { RequestStatus } from '@/types/service-request.types';

type StatusProgressBarProps = HTMLAttributes<HTMLDivElement> & {
  status: RequestStatus;
  showLabel?: boolean;
};

export function StatusProgressBar({
  className,
  status,
  showLabel = true,
}: StatusProgressBarProps) {
  const { t } = useTranslation('pages');

  const statusOrder = useMemo(
    () => ({
      submitted: 1,
      in_progress: 2,
      resolved: 3,
      closed: 4,
    }),
    []
  );

  const stages = useMemo(
    () => [
      { key: 'submitted', labelKey: 'serviceRequests.statuses.submitted' },
      { key: 'in_progress', labelKey: 'serviceRequests.statuses.in_progress' },
      { key: 'resolved', labelKey: 'serviceRequests.statuses.resolved' },
      { key: 'closed', labelKey: 'serviceRequests.statuses.closed' },
    ],
    []
  );

  const currentOrder = statusOrder[status];

  const getStageStyle = (stageIndex: number) => {
    const stageOrder = stageIndex + 1;
    if (stageOrder < currentOrder) {
      return {
        circle: 'bg-green-500',
        line: 'bg-green-500',
      };
    }
    if (stageOrder === currentOrder) {
      return {
        circle: 'bg-blue-500',
        line: 'bg-blue-500',
      };
    }
    return {
      circle: 'border-2 border-gray-300 bg-white dark:bg-gray-800',
      line: 'bg-gray-300',
    };
  };

  return (
    <div className={cn('flex w-full items-center gap-1', className)}>
      {stages.map((stage, index) => {
        const styles = getStageStyle(index);
        return (
          <div key={stage.key} className="flex items-center gap-1 flex-1">
            {index > 0 && (
              <div className={`h-1 flex-1 ${styles.line} transition-all duration-300`} />
            )}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${styles.circle} transition-all duration-300 flex-shrink-0`}
              />
              {showLabel && (
                <span className="text-xs text-center whitespace-nowrap">
                  {t(stage.labelKey as any)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
