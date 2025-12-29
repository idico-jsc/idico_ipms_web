import { Phone } from "lucide-react";
import { Button } from "@atoms/button";
import { cn } from "@/utils";

interface PhoneAuthButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}

export function PhoneAuthButton({
  onClick,
  isLoading,
  disabled,
  children,
}: PhoneAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={isLoading || disabled}
      className={cn(
        "w-full",
        isLoading && "cursor-not-allowed opacity-50"
      )}
    >
      <Phone className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}
