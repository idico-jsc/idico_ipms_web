import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/atoms/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select';
import { RequestTypeSelector } from './request-type-selector';
import { ImageUpload } from '@/components/molecules';
import type { ServiceRequestFormData, Priority } from '@/types/service-request.types';

interface ServiceRequestFormProps {
  formData: ServiceRequestFormData;
  formErrors: Partial<Record<keyof ServiceRequestFormData, string>>;
  onChange: (data: ServiceRequestFormData) => void;
  onError: (errors: Partial<Record<keyof ServiceRequestFormData, string>>) => void;
}

export function ServiceRequestForm({
  formData,
  formErrors,
  onChange,
}: ServiceRequestFormProps) {
  const { t } = useTranslation('pages');

  return (
    <div className="grid gap-4">
      {/* Request Type */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">
          {t('serviceRequests.form.requestType')}
        </label>
        <RequestTypeSelector
          value={formData.request_type}
          onChange={(value) =>
            onChange({ ...formData, request_type: value })
          }
          error={formErrors.request_type}
        />
      </div>

      {/* Priority */}
      <div className="grid gap-2">
        <label htmlFor="priority" className="text-sm font-medium">
          {t('serviceRequests.form.priority')}
        </label>
        <Select
          value={formData.priority}
          onValueChange={(value: Priority) =>
            onChange({ ...formData, priority: value })
          }
        >
          <SelectTrigger id="priority">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">{t('serviceRequests.priorities.low')}</SelectItem>
            <SelectItem value="medium">{t('serviceRequests.priorities.medium')}</SelectItem>
            <SelectItem value="high">{t('serviceRequests.priorities.high')}</SelectItem>
            <SelectItem value="urgent">{t('serviceRequests.priorities.urgent')}</SelectItem>
          </SelectContent>
        </Select>
        {formErrors.priority && (
          <p className="text-sm text-destructive">{formErrors.priority}</p>
        )}
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          {t('serviceRequests.form.description')}
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            onChange({ ...formData, description: e.target.value })
          }
          placeholder={t('serviceRequests.form.descriptionPlaceholder')}
          rows={5}
        />
        {formErrors.description && (
          <p className="text-sm text-destructive">{formErrors.description}</p>
        )}
      </div>

      {/* Location */}
      <div className="grid gap-2">
        <label htmlFor="location" className="text-sm font-medium">
          {t('serviceRequests.form.location')}
        </label>
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) =>
            onChange({ ...formData, location: e.target.value })
          }
          placeholder={t('serviceRequests.form.locationPlaceholder')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        />
        {formErrors.location && (
          <p className="text-sm text-destructive">{formErrors.location}</p>
        )}
      </div>

      {/* Images */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">
          {t('serviceRequests.form.images')}
        </label>
        <ImageUpload
          images={formData.images}
          onChange={(images) => onChange({ ...formData, images })}
        />
      </div>
    </div>
  );
}
