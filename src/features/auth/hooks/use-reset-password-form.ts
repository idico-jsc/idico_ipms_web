import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import zxcvbn from "zxcvbn";
import { PASSWORD_STRENGTH_THRESHOLD } from "@/constants/env";

export const useResetPasswordForm = () => {
  const { i18n, t } = useTranslation("fields");
  const resetPasswordSchema = useMemo(
    () =>
      z
        .object({
          password: z
            .string()
            .min(6, { message: t("password.error.tooShort") })
            .refine(
              (password) => {
                const result = zxcvbn(password);
                return result.score >= PASSWORD_STRENGTH_THRESHOLD;
              },
              { message: t("password.error.tooWeak") || "Password is too weak" }
            ),
          confirmPassword: z.string().min(1, { message: t("password.error.required") }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("confirmPassword.error.notMatch") || "Passwords do not match",
          path: ["confirmPassword"],
        }),
    [i18n.language],
  );
  type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

  return useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
};
