import { APP_VERSION } from '@/constants/version';
import { cn } from '@/utils/cn';

interface VersionDisplayProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
  variant?: 'default' | 'badge' | 'minimal';
}

export function VersionDisplay({
  className,
  position = 'bottom-right',
  variant = 'default',
}: VersionDisplayProps) {
  const positionClasses = {
    'top-left': 'fixed top-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'bottom-right': 'fixed bottom-4 right-4',
    inline: '',
  };

  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-md text-sm',
    badge: 'bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold',
    minimal: 'text-gray-500 dark:text-gray-400 text-xs',
  };

  return (
    <div
      className={cn(
        positionClasses[position],
        variantClasses[variant],
        'z-50',
        className
      )}
    >
      v{APP_VERSION}
    </div>
  );
}
