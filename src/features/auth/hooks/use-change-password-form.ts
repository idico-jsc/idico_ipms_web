import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import zxcvbn from 'zxcvbn';
import { PASSWORD_STRENGTH_THRESHOLD } from '@/constants/env';

export const useChangePasswordForm = () => {
  const { i18n, t } = useTranslation('fields');
  const changePasswordSchema = useMemo(
    () =>
      z
        .object({
          currentPassword: z.string().min(1, { message: (t as (key: string) => string)('currentPassword.error.required') || 'Current password is required' }),
          newPassword: z
            .string()
            .min(6, { message: (t as (key: string) => string)('password.error.tooShort') })
            .refine(
              (password) => {
                const result = zxcvbn(password);
                return result.score >= PASSWORD_STRENGTH_THRESHOLD;
              },
              { message: (t as (key: string) => string)('password.error.tooWeak') || 'Password is too weak' }
            ),
          confirmPassword: z.string().min(1, { message: (t as (key: string) => string)('password.error.required') }),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: (t as (key: string) => string)('confirmPassword.error.notMatch') || 'Passwords do not match',
          path: ['confirmPassword'],
        })
        .refine((data) => data.currentPassword !== data.newPassword, {
          message: (t as (key: string) => string)('newPassword.error.sameAsCurrent') || 'New password must be different from current password',
          path: ['newPassword'],
        }),
    [i18n.language]
  );
  type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

  return useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
};
