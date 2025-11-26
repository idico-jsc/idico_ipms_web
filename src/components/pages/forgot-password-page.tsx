import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { ScreenLayout } from "../templates";
import { cn } from "@/utils";
import { HTMLAttributes } from "react";

type ForgotPasswordPageProps = HTMLAttributes<HTMLDivElement> & {};

export function ForgotPasswordPage({ className }: ForgotPasswordPageProps) {
  return (
    <ScreenLayout className={cn("max-w-lg h-auto m-auto p-2 md:p-10",className)}>
      <ForgotPasswordForm />
    </ScreenLayout>
  );
}
