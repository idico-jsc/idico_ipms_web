import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

export const useForgotPasswordForm = () => {
  const { i18n, t } = useTranslation("fields");
  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, { message: t("email.error.required") })
          .email({ message: t("email.error.invalid") }),
      }),
    [i18n.language],
  );
  type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

  return useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
};
