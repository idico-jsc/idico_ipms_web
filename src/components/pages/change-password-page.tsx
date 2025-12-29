/**
 * Change Password Page
 *
 * Features:
 * - Current password verification
 * - New password with confirmation
 * - Password strength indicator
 * - Form validation
 * - Security best practices
 */

import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/atoms/button';
import { cn } from '@/utils';
import { ChangePasswordForm } from '@/features/auth/components/change-password-form';

interface Props extends React.ComponentProps<'div'> { }

export const ChangePasswordPage = ({ className, ...rest }: Props) => {
  const navigate = useNavigate();

  return (
    <div className={cn('min-h-screen bg-background pb-10 md:pb-8', className)} {...rest}>
      <div className="container mx-auto max-w-md py-6 space-y-6">

        <div className="hidden md:block space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Change Password</h1>
          <p className="text-muted-foreground text-sm">
            Update your password to keep your account secure
          </p>
        </div>
        <ChangePasswordForm />

      </div>
    </div>
  );
};
