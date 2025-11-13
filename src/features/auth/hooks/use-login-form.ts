import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

export const useLoginForm = () => {
  const { i18n, t } = useTranslation("fields");
  const loginSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, { message: t("email.error.required") })
          .email({ message: t("email.error.invalid") }),
        password: z.string().min(1, { message: t("password.error.required") }),
      }),
    [i18n.language],
  );
  type LoginFormValues = z.infer<typeof loginSchema>;

  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
};
