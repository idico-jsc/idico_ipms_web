import * as React from "react";
import { Button, ButtonProps } from "@/components/atoms/button";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { cn } from "@/utils/cn";

export interface LoadingButtonProps extends ButtonProps {
  /**
   * Whether the button is in loading state
   */
  loading?: boolean;
  /**
   * Text to display when loading (optional)
   * If not provided, children will be used
   */
  loadingText?: string;
  /**
   * Size of the loading spinner
   * Defaults to "sm" for button usage
   */
  spinnerSize?: "sm" | "md";
  /**
   * Custom className for the spinner
   */
  spinnerClassName?: string;
}

/**
 * Loading Button Component
 *
 * A molecule component that extends the Button atom with loading state functionality.
 * Displays a LoadingSpinner to the left of the button text when in loading state.
 *
 * Features:
 * - Shows loading spinner on the left side of text
 * - Automatically disables button when loading
 * - Optional custom loading text
 * - Maintains all Button atom functionality
 * - Accessible with proper ARIA attributes
 *
 * @example
 * ```tsx
 * <LoadingButton loading={isLoading} loadingText="Saving...">
 *   Save Changes
 * </LoadingButton>
 * ```
 *
 * @example
 * ```tsx
 * <LoadingButton
 *   loading={isSubmitting}
 *   variant="destructive"
 *   size="lg"
 * >
 *   Delete Account
 * </LoadingButton>
 * ```
 */
export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      loading = false,
      loadingText,
      spinnerSize = "sm",
      spinnerClassName,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        className={cn(className)}
        aria-busy={loading}
        aria-live="polite"
        {...props}
      >
        {loading && (
          <LoadingSpinner
            size={spinnerSize}
            className={cn("mr-2", spinnerClassName)}
            aria-hidden="true"
          />
        )}
        {loading && loadingText ? loadingText : children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";