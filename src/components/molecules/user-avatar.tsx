/**
 * User Avatar Component
 *
 * Avatar component for displaying user profile picture
 * - Uses ui-avatars.com API for fallback/generated avatars
 * - Supports custom image URL
 * - Multiple size variants
 */

import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar';
import { cn } from '@/utils';

interface UserAvatarProps {
  /**
   * User's full name (used for generated avatar)
   */
  name?: string;
  /**
   * Custom image URL (takes priority over generated avatar)
   */
  imageUrl?: string;
  /**
   * Size variant
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Background color for generated avatar
   * @default 'random'
   */
  backgroundColor?: string;
  /**
   * Show border
   * @default false
   */
  showBorder?: boolean;
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-24 w-24 text-xl',
};

export function UserAvatar({
  name = 'User',
  imageUrl,
  size = 'md',
  className,
  backgroundColor = 'random',
  showBorder = false,
}: UserAvatarProps) {
  /**
   * Generate avatar URL using ui-avatars.com
   * https://ui-avatars.com/
   */
  const generateAvatarUrl = (userName: string) => {
    const params = new URLSearchParams({
      name: userName,
      background: backgroundColor,
      color: 'fff',
      bold: 'true',
      size: '128',
    });
    return `https://ui-avatars.com/api/?${params.toString()}`;
  };

  // Get user initials for fallback (Vietnamese style - last 2 words)
  const getUserInitials = () => {
    if (!name) return 'U';
    const names = name.trim().split(' ').filter(n => n.length > 0);

    if (names.length >= 2) {
      // Take last 2 words (Vietnamese name convention - given name)
      return `${names[names.length - 2]} ${names[names.length - 1]}`;
    }

    // Fallback to full name if only one word
    return name;
  };

  const generatedAvatarUrl = generateAvatarUrl(getUserInitials());

  return (
    <Avatar
      className={cn(
        sizeClasses[size],
        showBorder && 'border-2 border-border',
        className
      )}
    >
      {/* Custom image URL has priority */}
      {imageUrl && <AvatarImage className="object-cover" src={imageUrl} alt={name} />}

      {/* Generated avatar from ui-avatars.com */}
      <AvatarImage src={generatedAvatarUrl} alt={name} />

      {/* Text fallback */}
      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
        {getUserInitials()}
      </AvatarFallback>
    </Avatar>
  );
}
