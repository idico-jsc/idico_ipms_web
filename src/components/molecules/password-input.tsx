import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@atoms/input";
import { Button } from "@atoms/button";
import { cn } from "@/utils";

export interface PasswordInputProps extends React.ComponentProps<"input"> {
  /**
   * Custom className for the wrapper div
   */
  wrapperClassName?: string;
}

/**
 * Password Input Component
 *
 * A molecule component that combines an Input atom with a toggle button
 * to show/hide password visibility.
 *
 * Features:
 * - Toggle between password and text input types
 * - Eye/EyeOff icon button
 * - Supports all standard input props
 * - Forward ref support
 *
 * @example
 * ```tsx
 * <PasswordInput
 *   placeholder="Enter password"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 * ```
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, wrapperClassName, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className={cn("relative", wrapperClassName)}>
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={togglePasswordVisibility}
          aria-label="Toggle password visibility"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
