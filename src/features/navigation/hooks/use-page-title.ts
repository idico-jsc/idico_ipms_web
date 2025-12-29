/**
 * usePageTitle Hook
 *
 * Extracts page title from current route and translates it
 * - Converts pathname to i18n key
 * - Looks up translation in menu.json
 * - Provides formatted fallback
 */

import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';

/**
 * Get page title from current route
 * Extracts last segment from pathname and looks up translation in menu.json
 */
export function usePageTitle(): string {
  const location = useLocation();
  const { t } = useTranslation('menu');

  // Extract last segment from pathname
  const segments = location.pathname.split('/').filter(Boolean);

  // Root path -> home
  if (segments.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return t('items.home' as any);
  }

  const lastSegment = segments[segments.length - 1];

  // Convert kebab-case to camelCase: sales-report -> salesReport
  const camelCaseKey = lastSegment.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

  // Try to get translation from menu.json
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const translation = t(`items.${camelCaseKey}` as any, { defaultValue: '' });

  if (translation) {
    return translation;
  }

  // Fallback: Format the segment nicely
  // some-path -> Some Path
  return lastSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
