import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@atoms/dialog';
import { ChangePasswordForm } from './change-password-form';

interface ChangePasswordModalProps {
  children: React.ReactNode;
}

export function ChangePasswordModal({ children }: ChangePasswordModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your password to keep your account secure</DialogDescription>
        </DialogHeader>
        <ChangePasswordForm onCancel={() => setOpen(false)} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
