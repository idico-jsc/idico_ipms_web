import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { CredentialResponse } from "@react-oauth/google";
import { LoadingButton } from "@/components/molecules/loading-button";
import { GoogleButton } from "./google-button";
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
  const { login, loginWithGoogle, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Check if Google OAuth is configured
  const isGoogleOAuthEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

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

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError("No credential received from Google");
      return;
    }

    setIsGoogleLoading(true);
    try {
      // credential is the JWT ID token
      await loginWithGoogle(credentialResponse.credential);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Google login failed";
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google OAuth error");
    setError("Failed to authenticate with Google");
    setIsGoogleLoading(false);
  };

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
            className="w-full uppercase"
            loading={isLoading}
            loadingText={t("auth.login.submittingButton")}
          >
            {t("auth.login.submitButton")}
          </LoadingButton>
        </form>
      </Form>
      {isGoogleOAuthEnabled && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">
                {t("auth.login.orContinueWith")}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <GoogleButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              isLoading={isGoogleLoading}
              disabled={isLoading}
            >
              {t("auth.login.googleButton")}
            </GoogleButton>
          </div>{" "}
        </>
      )}
    </div>
  );
}
