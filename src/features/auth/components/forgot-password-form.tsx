import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { LoadingButton } from "@/components/molecules/loading-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { cn } from "@/utils";
import { RETRY_DELAY } from "@/constants/env";
import { useForgotPasswordForm } from "../hooks/use-forgot-password-form";
import { forgotPassword } from "../services/api";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import { useNetworkStatus } from "@/providers/network-provider";

export function ForgotPasswordForm() {
  const { t } = useTranslation(["pages", "buttons"]);
  const form = useForgotPasswordForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isOnline } = useNetworkStatus();

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsLoading(true);
    try {
      await forgotPassword(values.email);
      setIsSuccess(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email";
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  });

  if (isSuccess) {
    return <SendRequestSuccess onClose={() => setIsSuccess(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("forgotPasswordPage.title") || "Forgot Password"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("forgotPasswordPage.subtitle") ||
            "Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("forgotPasswordPage.email") || "Email"}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={
                      t("forgotPasswordPage.emailPlaceholder") || "Enter your email address"
                    }
                    autoComplete="email"
                    disabled={isLoading || !isOnline}
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
            className="w-full"
            loading={isLoading}
            disabled={!isOnline}
            loadingText={t("forgotPasswordPage.submittingButton") || "Sending..."}
          >
            {!isOnline ? t("offline.formDisabled") : (t("buttons:send_request") || "Send Reset Link")}
          </LoadingButton>
        </form>
      </Form>

      <div className="text-center text-sm">
        <Link to="/login" className="text-primary hover:underline">
          ← {t("forgotPasswordPage.backToLogin") || "Back to login"}
        </Link>
      </div>
    </div>
  );
}

const SendRequestSuccess = ({ onClose }: { onClose?: () => void }) => {
  const { t } = useTranslation(["pages", "buttons"]);
  const [countdown, setCountdown] = useState(RETRY_DELAY);
  const isDisabled = countdown > 0;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleTryAgain = () => {
    setCountdown(RETRY_DELAY);
    onClose?.();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CircleCheck
          strokeWidth={1}
          className="mx-auto mb-2 h-20 w-20 text-green-600 dark:text-green-400"
        />
        <h2 className="mb-2 text-xl font-semibold text-green-600">
          {t("forgotPasswordPage.successMessage.title")}
        </h2>
        <p className="mb-4">{t("forgotPasswordPage.successMessage.message")}</p>
        <p className="text-muted-foreground text-sm">
          {t("forgotPasswordPage.successMessage.not_received")}
        </p>
      </div>

      <div className="flex flex-col gap-4 text-center">
        <Button onClick={handleTryAgain} disabled={isDisabled}>
          {isDisabled ? `${t("buttons:try_again")} (${countdown}s)` : t("buttons:try_again")}
        </Button>
        <Link to="/login" className="text-primary text-sm hover:underline">
          ← Back to login
        </Link>
      </div>
    </div>
  );
};
