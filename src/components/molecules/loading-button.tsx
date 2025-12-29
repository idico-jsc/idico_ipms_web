import * as React from "react";
import { Button, buttonVariants } from "@atoms/button";
import { LoadingSpinner } from "@atoms/loading-spinner";
import { cn } from "@/utils/cn";
import type { VariantProps } from "class-variance-authority";

export type LoadingButtonProps = VariantProps<typeof buttonVariants> & React.ComponentProps<"button"> & {
  loading?: boolean;
  loadingText?: string;
  spinnerSize?: "sm" | "md";
  spinnerClassName?: string;
}

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