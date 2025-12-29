import { useTranslation } from 'react-i18next';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@atoms/alert-dialog';
import type { ServiceRequest } from '@/types/service-request.types';

interface DeleteServiceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: ServiceRequest | null;
  onConfirm: () => void;
}

export function DeleteServiceRequestDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
}: DeleteServiceRequestDialogProps) {
  const { t } = useTranslation('pages');

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('serviceRequests.confirmDelete')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('serviceRequests.confirmDeleteMessage')}
            {request && (
              <span className="mt-2 block font-medium text-foreground">
                {request.title}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('serviceRequests.form.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('serviceRequests.deleteRequest')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
