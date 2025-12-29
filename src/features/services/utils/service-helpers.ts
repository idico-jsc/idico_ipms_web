import type { RequestType, RequestStatus, Priority } from '@/types/service-request.types';

/**
 * Generate a title for a service request based on type and timestamp
 */
export function generateRequestTitle(type: RequestType, t: (key: string) => string): string {
  const typeLabel = t(`serviceRequests.requestTypes.${type}`);
  const timestamp = new Date().getTime().toString().slice(-9);
  return `${typeLabel} - #${timestamp}`;
}

/**
 * Get the color class for a priority badge
 */
export function getPriorityColor(priority: Priority): 'secondary' | 'default' | 'destructive' {
  const colorMap: Record<Priority, 'secondary' | 'default' | 'destructive'> = {
    low: 'secondary',
    medium: 'default',
    high: 'default',
    urgent: 'destructive',
  };
  return colorMap[priority];
}

/**
 * Get the progress percentage for a status
 */
export function getStatusProgress(status: RequestStatus): number {
  const statusOrder = {
    submitted: 1,
    in_progress: 2,
    resolved: 3,
    closed: 4,
  };
  return (statusOrder[status] / 4) * 100;
}

/**
 * Check if a status is final (cannot be changed)
 */
export function isFinalStatus(status: RequestStatus): boolean {
  return status === 'closed';
}

/**
 * Get the next status in the workflow
 */
export function getNextStatus(currentStatus: RequestStatus): RequestStatus | null {
  const statusFlow: Record<RequestStatus, RequestStatus | null> = {
    submitted: 'in_progress',
    in_progress: 'resolved',
    resolved: 'closed',
    closed: null,
  };
  return statusFlow[currentStatus];
}

/**
 * Validate image file
 */
export function validateImageFile(file: File, maxSize: number = 5 * 1024 * 1024): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid image format. Please use JPG, PNG, or WebP.' };
  }

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return { valid: false, error: `Image size must be less than ${maxSizeMB}MB` };
  }

  return { valid: true };
}

/**
 * Convert file to base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
