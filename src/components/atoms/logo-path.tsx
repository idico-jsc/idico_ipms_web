import { HTMLAttributes, type FC } from 'react';
import { cn } from '@/utils';

export type LogoPathProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Variant of the logo path
   * - vertical: Default vertical orientation (top to bottom)
   * - horizontal: Horizontal orientation (left to right)
   * @default 'vertical'
   */
  variant?: 'vertical' | 'horizontal';
};

export const LogoPath: FC<LogoPathProps> = ({ className, variant = 'vertical' }) => {
  // Vertical clip path (original)
  const verticalClipPath = 'polygon(0 0, 100% 0, 100% calc(100% - 2.5vw), 62% 100%, 0 calc(68% - 0.5vw))';

  // Horizontal clip path (rotated 90 degrees)
  const horizontalClipPath = 'polygon(0px 0px, calc(79% - 5.5vh) 0px, 86% 43%, calc(100% - 21vh) 100%, 0px 100%)';

  return (
    <div
      className={cn('', className)}
      style={{
        clipPath: variant === 'horizontal' ? horizontalClipPath : verticalClipPath,
      }}
    />
  );
};
