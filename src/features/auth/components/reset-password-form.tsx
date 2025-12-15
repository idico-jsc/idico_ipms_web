import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { LoadingButton } from "@/components/molecules/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { PasswordInput } from "@/components/molecules/password-input";
import { PasswordStrengthIndicator } from "@/components/molecules/password-strength-indicator";
import { cn } from "@/utils";
import { useResetPasswordForm } from "../hooks/use-reset-password-form";
import { useNetworkStatus } from "@/providers/network-provider";
import { useAuth } from "../hooks/use-auth";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { AUTO_REDIRECT_DELAY } from "@/constants/env";
import { getPath } from "@/features/navigation";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { t } = useTranslation(["pages", "buttons", "fields"]);
  const form = useResetPasswordForm();
  const { reset, isResettingPassword: isSubmitting } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const { isOnline } = useNetworkStatus();

  const handleSubmit = form.handleSubmit(async (values) => {
    await reset(token, values.password);
    setIsSuccess(true);
  });

  if (isSuccess) {
    return <ResetPasswordSuccess />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("resetPasswordPage.title") || "Reset Password"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("resetPasswordPage.subtitle") || "Enter your new password below."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t("fields:newPassword.label") || "New Password"} </FormLabel>
                  <PasswordStrengthIndicator className="w-1/3" password={field.value} />
                </div>
                <p className="text-muted-foreground text-xs">
                  {t("fields:newPassword.description")}
                </p>
                <FormControl>
                  <PasswordInput
                    placeholder={t("fields:newPassword.placeholder") || "Enter your new password"}
                    autoComplete="new-password"
                    disabled={isSubmitting || !isOnline}
                    {...field}
                    className={cn(fieldState.invalid && "border-destructive")}
                  />
                </FormControl>

                <div className="h-auto">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("fields:confirmPassword.label") || "Confirm Password"}</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder={
                      t("fields:confirmPassword.placeholder") || "Confirm your new password"
                    }
                    autoComplete="new-password"
                    disabled={isSubmitting || !isOnline}
                    {...field}
                    className={cn(fieldState.invalid && "border-destructive")}
                  />
                </FormControl>
                <div className="h-auto">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <LoadingButton
            type="submit"
            className="mt-4 w-full"
            size="lg"
            loading={isSubmitting}
            disabled={!isOnline}
            loadingText={t("buttons:reset_password") || "Resetting..."}
          >
            {!isOnline
              ? t("offline.formDisabled")
              : t("buttons:reset_password") || "Reset Password"}
          </LoadingButton>
        </form>
      </Form>

      <div className="text-center text-sm">
        <Link to={getPath.login()} className="text-primary hover:underline">
          ← {t("buttons:backToLogin") || "Back to login"}
        </Link>
      </div>
    </div>
  );
}

const ResetPasswordSuccess = () => {
  const { t } = useTranslation(["pages", "buttons"]);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_DELAY);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      navigate(getPath.login());
    }
  }, [countdown, navigate]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CircleCheck
          strokeWidth={1}
          className="mx-auto mb-2 h-20 w-20 text-green-600 dark:text-green-400"
        />
        <h2 className="mb-2 text-xl font-semibold text-green-600">
          {t("resetPasswordPage.successMessage.title") || "Password Reset Successful"}
        </h2>
        <p className="mb-4">
          {t("resetPasswordPage.successMessage.message") ||
            "Your password has been successfully reset. You can now login with your new password."}
        </p>
        <p className="text-muted-foreground text-sm">
          {t("resetPasswordPage.successMessage.redirect", { countdown }) ||
            `Redirecting to login page in ${countdown} seconds...`}
        </p>
      </div>

      <div className="flex flex-col gap-4 text-center">
        <Button onClick={() => navigate(getPath.login())}>
          {t("buttons:go_to_login") || "Go to Login"}
        </Button>
      </div>
    </div>
  );
};
