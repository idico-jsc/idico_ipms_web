import { useState } from 'react';
import { CircleCheck, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { LoadingButton } from '@/components/molecules/loading-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/atoms/form';
import { PasswordInput } from '@/components/molecules/password-input';
import { PasswordStrengthIndicator } from '@/components/molecules/password-strength-indicator';
import { cn } from '@/utils';
import { useChangePasswordForm } from '../hooks/use-change-password-form';
import { useNetworkStatus } from '@/providers/network-provider';
import { useAuth } from '../hooks/use-auth';
import { Button } from '@/components/atoms/button';
import { getPath } from '@/features/navigation';

interface ChangePasswordFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export function ChangePasswordForm({ onCancel, onSuccess }: ChangePasswordFormProps) {
  const navigate = useNavigate();
  const form = useChangePasswordForm();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isOnline } = useNetworkStatus();

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);

    try {
      // TODO: Implement password change API call
      console.log('Changing password for user:', user?.name);
      console.log('Values:', values);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error('Password change failed:', error);
      form.setError('currentPassword', {
        message: 'Current password is incorrect',
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  if (isSuccess) {
    return <ChangePasswordSuccess onClose={onSuccess} />;
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <FormField
            name="currentPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Current Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    disabled={isSubmitting || !isOnline}
                    {...field}
                    className={cn("text-sm md:text-base", {
                      'border-destructive': fieldState.invalid
                    })}
                  />
                </FormControl>
                <div className="h-auto">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* New Password */}
          <FormField
            name="newPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>New Password</FormLabel>
                  <PasswordStrengthIndicator className="w-1/3" password={field.value} />
                </div>
                <p className="text-muted-foreground text-xs">
                  Must be at least 6 characters with a mix of letters, numbers & symbols
                </p>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    disabled={isSubmitting || !isOnline}
                    {...field}
                    className={cn("text-sm md:text-base", {
                      'border-destructive': fieldState.invalid
                    })}
                  />
                </FormControl>
                <div className="h-auto">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    disabled={isSubmitting || !isOnline}
                    {...field}
                    className={cn("text-sm md:text-base", {
                      'border-destructive': fieldState.invalid
                    })}
                  />
                </FormControl>
                <div className="h-auto">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row gap-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <LoadingButton
              type="submit"
              className="flex-1"
              loading={isSubmitting}
              disabled={!isOnline}
              loadingText="Changing..."
            >
              {!isOnline ? 'No connection' : 'Change Password'}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface ChangePasswordSuccessProps {
  onClose?: () => void;
}

const ChangePasswordSuccess = ({ onClose }: ChangePasswordSuccessProps) => {
  const navigate = useNavigate();

  // If used in modal, show simplified success message
  if (onClose) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CircleCheck
            strokeWidth={1}
            className="mx-auto mb-2 h-20 w-20 text-green-600 dark:text-green-400"
          />
          <h2 className="mb-2 text-xl font-semibold text-green-600">
            Password Changed Successfully
          </h2>
          <p className="text-muted-foreground">
            Your password has been successfully changed. You can now use your new password to login.
          </p>
        </div>

        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </div>
    );
  }

  // If used in page, show navigation options
  return (
    <div className="space-y-6">
      <div className="text-center">
        <CircleCheck
          strokeWidth={1}
          className="mx-auto mb-2 h-20 w-20 text-green-600 dark:text-green-400"
        />
        <h2 className="mb-2 text-xl font-semibold text-green-600">
          Password Changed Successfully
        </h2>
        <p className="text-muted-foreground">
          Your password has been successfully changed. You can now use your new password to login.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button onClick={() => navigate(getPath.settingsProfile())} className="w-full">
          Back to Profile
        </Button>
        <Button variant="outline" onClick={() => navigate(getPath.home())} className="w-full">
          Go to Home
        </Button>
      </div>
    </div>
  );
};
