import { LoadingSpinner } from "@/components/atoms";
import { cn } from "@/utils/cn";

interface FullPageLoaderProps {
  message?: string;
  className?: string;
  spinnerSize?: "sm" | "md" | "lg" | "xl";
}

/**
 * Full Page Loader Component (Molecule)
 *
 * Displays a centered loading spinner that covers the entire viewport.
 * Used for initial app loading, authentication checks, etc.
 *
 * This is a molecule because it combines multiple atoms:
 * - LoadingSpinner (atom)
 * - Text/Typography (native HTML)
 * - Container with backdrop
 *
 * Features:
 * - Full viewport coverage with backdrop
 * - Centered spinner with optional message
 * - Accessible with ARIA labels
 * - Smooth fade-in animation
 *
 * @example
 * ```tsx
 * <FullPageLoader message="Loading your account..." />
 * ```
 */
export function FullPageLoader({
  message,
  className,
  spinnerSize = "xl"
}: FullPageLoaderProps) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center",
        // Explicit dark mode support - works with theme toggle
        "bg-background",
        "animate-in fade-in duration-200",
        className
      )}
      role="alert"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={spinnerSize} />
        {message && (
          <p className="md:text-lg text-foreground animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
