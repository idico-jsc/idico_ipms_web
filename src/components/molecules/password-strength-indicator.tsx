import { HTMLAttributes, useEffect, useMemo, useState } from "react";
import zxcvbn from "zxcvbn";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";

type PasswordStrengthIndicatorProps = HTMLAttributes<HTMLDivElement> & {
  password: string;
  onStrengthChange?: (score: number) => void;
};

export function PasswordStrengthIndicator({
  className,
  password,
  onStrengthChange,
}: PasswordStrengthIndicatorProps) {
  const { t } = useTranslation("fields");
  const [strength, setStrength] = useState<zxcvbn.ZXCVBNResult | null>(null);

  const strengthConfig = useMemo(
    () => ({
      0: {
        label: t("password.strength_level.veryWeak") || "Very Weak",
        color: "bg-red-400",
        textColor: "text-red-400",
      },
      1: {
        label: t("password.strength_level.weak") || "Weak",
        color: "bg-orange-400",
        textColor: "text-orange-400",
      },
      2: {
        label: t("password.strength_level.medium") || "Medium",
        color: "bg-yellow-400",
        textColor: "text-yellow-400",
      },
      3: {
        label: t("password.strength_level.strong") || "Strong",
        color: "bg-blue-400",
        textColor: "text-blue-400",
      },
      4: {
        label: t("password.strength_level.veryStrong") || "Very Strong",
        color: "bg-green-400",
        textColor: "text-green-400",
      },
    }),
    [t],
  );
  useEffect(() => {
    if (password.length === 0) {
      setStrength(null);
      return;
    }
    const result = zxcvbn(password);
    setStrength(result);
    onStrengthChange?.(result.score);
  }, [password]);

  if (!strength || password.length === 0) {
    return null;
  }

  const config = strengthConfig[strength.score as keyof typeof strengthConfig];
  const widthPercentage = ((strength.score + 1) / 5) * 100;

  return (
    <div className={cn("flex w-full justify-end space-y-2", className)}>
      <div className="flex w-full items-center gap-1">
        <div className={`text-xs font-medium ${config.textColor}`}>{config.label}</div>
        <div className="h-1 w-full flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-full transition-all duration-300 ${config.color}`}
            style={{ width: `${widthPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
