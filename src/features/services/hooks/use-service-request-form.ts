import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { ServiceRequestFormData } from '@/types/service-request.types';

const initialFormData: ServiceRequestFormData = {
  request_type: 'infrastructure',
  priority: 'medium',
  description: '',
  location: '',
  images: [],
};

export function useServiceRequestForm() {
  const { t } = useTranslation('pages');
  const [formData, setFormData] = useState<ServiceRequestFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ServiceRequestFormData, string>>>({});

  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof ServiceRequestFormData, string>> = {};

    if (!formData.request_type) {
      errors.request_type = t('serviceRequests.form.errors.requestTypeRequired');
    }

    if (!formData.priority) {
      errors.priority = t('serviceRequests.form.errors.priorityRequired');
    }

    if (!formData.description.trim()) {
      errors.description = t('serviceRequests.form.errors.descriptionRequired');
    } else if (formData.description.trim().length < 10) {
      errors.description = t('serviceRequests.form.errors.descriptionTooShort');
    } else if (formData.description.trim().length > 1000) {
      errors.description = t('serviceRequests.form.errors.descriptionTooLong');
    }

    if (!formData.location.trim()) {
      errors.location = t('serviceRequests.form.errors.locationRequired');
    } else if (formData.location.trim().length < 3) {
      errors.location = t('serviceRequests.form.errors.locationTooShort');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, t]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormErrors({});
  }, []);

  const updateFormData = useCallback((data: ServiceRequestFormData) => {
    setFormData(data);
  }, []);

  const setFormDataFromRequest = useCallback((request: any) => {
    setFormData({
      request_type: request.request_type,
      priority: request.priority,
      description: request.description,
      location: request.location,
      images: request.images,
    });
    setFormErrors({});
  }, []);

  return {
    formData,
    formErrors,
    validateForm,
    resetForm,
    updateFormData,
    setFormDataFromRequest,
    setFormData,
    setFormErrors,
  };
}
