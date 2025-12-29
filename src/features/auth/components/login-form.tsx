import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { CredentialResponse } from "@react-oauth/google";
import { LoadingButton } from "@/components/molecules/loading-button";
import { GoogleButton } from "./google-button";
import { PhoneAuthButton } from "./phone-auth-button";
import { PhoneAuthModal } from "./phone-auth-modal";
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
import { GOOGLE_CLIENT_ID } from "@/constants/env";
import { useLoginForm } from "@/features/auth/hooks/use-login-form";
import { useAuth } from "../hooks/use-auth";
import { useNetworkStatus } from "@/providers/network-provider";
import { useAuthDemo } from "../hooks/use-auth-demo";

interface LoginFormProps {
  onSubmit?: (email: string, password: string) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation("pages");
  const form = useLoginForm();
  const { login, loginWithGoogle, isLoading } = useAuth();
  const { loginDemo } = useAuthDemo()
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const { isOnline } = useNetworkStatus();

  // Check if Google OAuth is configured
  const isGoogleOAuthEnabled = Boolean(GOOGLE_CLIENT_ID);

  const handleSubmit = form.handleSubmit(async (values) => {
    const { email, password } = values;
    try {
      setError(null);
        console.log(" DEMO");
        
      await loginDemo(email).catch(async()=>{
        console.log("WRONG DEMO");
        
        await login(email, password)
      })

      await onSubmit?.(values.email, values.password);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t("loginPage.errors.generic");
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
      // const errorMessage = err instanceof Error ? err.message : "Google login failed";
      // setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = (error?: any) => {
    console.error("Google OAuth error:", error);

    // Extract detailed error message
    let errorMessage = "Failed to authenticate with Google";

    if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    setError(errorMessage);
    setIsGoogleLoading(false);
  };

  const handlePhoneAuthSuccess = (phoneNumber: string, verificationId: string) => {
    console.log("Phone authentication successful!");
    console.log("Phone Number:", phoneNumber);
    console.log("Verification ID:", verificationId);

    // Here you would typically send the verification ID to your backend
    // to complete the authentication process and get a token
    setError(null);
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("loginPage.email")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("loginPage.emailPlaceholder")}
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

          <FormField
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t("loginPage.password")}</FormLabel>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder={t("loginPage.passwordPlaceholder")}
                    autoComplete="current-password"
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
                    {t("loginPage.rememberMe")}
                  </FormLabel>
                </FormItem>
              )}
            /> */}
            <Link
              to="/forgot-password"
              className="text-primary text-sm hover:underline"
              tabIndex={-1}
            >
              {t("loginPage.forgotPassword")}
            </Link>
          </div>

          {error && (
            <div className="text-destructive bg-destructive/10 border-destructive/20 rounded-md border p-3 text-sm whitespace-pre-line">
              {error}
            </div>
          )}

          <LoadingButton
            type="submit"
            className="w-full uppercase"
            loading={isLoading}
            disabled={!isOnline}
            loadingText={t("loginPage.submittingButton")}
          >
            {!isOnline ? t("offline.formDisabled") : t("loginPage.submitButton")}
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
                {t("loginPage.orContinueWith")}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <GoogleButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              isLoading={isGoogleLoading}
              disabled={isLoading || !isOnline}
            >
              {t("loginPage.googleButton")}
            </GoogleButton>
            <PhoneAuthButton
              onClick={() => setIsPhoneModalOpen(true)}
              disabled={isLoading || !isOnline}
            >
              Continue with Phone
            </PhoneAuthButton>
          </div>{" "}
        </>
      )}

      {/* Phone Authentication Modal */}
      <PhoneAuthModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSuccess={handlePhoneAuthSuccess}
      />
    </div>
  );
}
