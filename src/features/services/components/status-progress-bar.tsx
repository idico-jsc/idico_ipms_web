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
    if (stageOrder <= currentOrder) {
      return {
        circle: 'bg-primary',
        line: 'bg-primary',
      };
    }
    return {
      circle: 'border-2 border-gray-300 bg-white dark:bg-gray-800',
      line: 'bg-gray-300',
    };
  };

  return (
    <div className={cn('flex items-start gap-2', className)}>
      {stages.map((stage, index) => {
        const styles = getStageStyle(index);
        const isLast = index === stages.length - 1;
        return (
          <div key={stage.key} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${styles.circle} transition-all duration-300 shrink-0`}
              />
              {showLabel && (
                <span className="text-xs text-center whitespace-nowrap">
                  {t(stage.labelKey as any)}
                </span>
              )}
            </div>
            {!isLast && (
              <div className={`w-8 md:w-12 h-0.5 ${styles.line} transition-all duration-300 -mt-3`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
