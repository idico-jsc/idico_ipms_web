import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();

  if (!token) return;
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
