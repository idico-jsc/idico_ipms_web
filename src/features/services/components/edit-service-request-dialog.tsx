import { useTranslation } from 'react-i18next';
import { Button } from '@atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@atoms/dialog';
import { ServiceRequestForm } from './service-request-form';
import type { ServiceRequestFormData } from '@/types/service-request.types';

interface EditServiceRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ServiceRequestFormData;
  formErrors: Partial<Record<keyof ServiceRequestFormData, string>>;
  onFormDataChange: (data: ServiceRequestFormData) => void;
  onSubmit: () => void;
}

export function EditServiceRequestDialog({
  open,
  onOpenChange,
  formData,
  formErrors,
  onFormDataChange,
  onSubmit,
}: EditServiceRequestDialogProps) {
  const { t } = useTranslation('pages');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('serviceRequests.editRequest')}</DialogTitle>
          <DialogDescription>
            Update the service request information below.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ServiceRequestForm
            formData={formData}
            formErrors={formErrors}
            onChange={onFormDataChange}
            onError={() => {}}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('serviceRequests.form.cancel')}
          </Button>
          <Button onClick={onSubmit}>
            {t('serviceRequests.form.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
