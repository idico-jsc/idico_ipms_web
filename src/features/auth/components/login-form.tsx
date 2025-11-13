import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { LoadingButton } from "@/components/molecules/loading-button";
import { Button } from "@/components/atoms/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { PasswordInput } from "@/components/molecules/password-input";
import { cn } from "@/utils";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";
import { useAuth } from "../hooks/use-auth";

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation("pages");
  const form = useLoginForm();
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = form.handleSubmit(async (values) => {
    const { email, password } = values;
    try {
      setError(null);

      await login(email, password);

      await onSubmit?.(values.email, values.password);
      // Redirect to the page user was trying to access, or home
      // const from = (location.state as any)?.from?.pathname || "/";
      // navigate(from, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("auth.login.errors.generic");
      setError(errorMessage);
    }
  });

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("auth.login.email")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("auth.login.emailPlaceholder")}
                    autoComplete="email"
                    disabled={isLoading}
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
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t("auth.login.password")}</FormLabel>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder={t("auth.login.passwordPlaceholder")}
                    autoComplete="current-password"
                    disabled={isLoading}
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

          <div className="flex items-center justify-between">
            {/* <FormField
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-y-0 space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer text-sm font-normal">
                    {t("auth.login.rememberMe")}
                  </FormLabel>
                </FormItem>
              )}
            /> */}
            <Link
              to="/forgot-password"
              className="text-primary text-sm hover:underline"
              tabIndex={-1}
            >
              {t("auth.login.forgotPassword")}
            </Link>
          </div>

          {error && (
            <div className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border p-3 text-sm">
              {error}
            </div>
          )}

          <LoadingButton
            type="submit"
            className="w-full"
            size="lg"
            loading={isLoading}
            loadingText={t("auth.login.submittingButton")}
          >
            {t("auth.login.submitButton")}
          </LoadingButton>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            {t("auth.login.orContinueWith")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button variant="outline" type="button" disabled={isLoading}>
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google
        </Button>
      </div>
    </div>
  );
}
