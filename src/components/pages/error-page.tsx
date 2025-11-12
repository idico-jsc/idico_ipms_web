import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@/components/atoms';
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  error?: Error | null;
  errorMessage?: string;
  statusCode?: number;
  showDetails?: boolean;
}

/**
 * Error Page Component
 *
 * A reusable error page that can be used throughout the application.
 * Features:
 * - Customizable error message and status code
 * - Optional error details display
 * - Navigation options (Back, Refresh, Home)
 * - Responsive design
 * - i18n support
 * - Development vs Production modes
 */
export const ErrorPage = ({
  error = null,
  errorMessage = 'An unexpected error occurred',
  statusCode = 500,
  showDetails = false,
}: ErrorPageProps) => {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  // Determine error details
  const displayMessage =
    errorMessage || error?.message || t('error.defaultMessage', {
      defaultValue: 'An unexpected error occurred'
    });

  const errorDetails = isDev && error?.stack ? error.stack : '';

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background">
      <div className="text-center max-w-2xl">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Status Code */}
        {statusCode && (
          <h1 className="text-6xl font-bold text-destructive mb-4">
            {statusCode}
          </h1>
        )}

        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          {displayMessage}
        </h2>

        {/* Error Details (Dev only or when showDetails is true) */}
        {(isDev || showDetails) && errorDetails && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground mb-2">
              {t('error.showDetails', { defaultValue: 'Show error details' })}
              {isDev && ' (dev only)'}
            </summary>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-60 text-left">
              {errorDetails}
            </pre>
          </details>
        )}

        {/* Description */}
        <p className="text-muted-foreground mt-4 mb-8">
          {isDev
            ? t('error.descriptionDev', {
                defaultValue: 'An error occurred. Check the console for more details.',
              })
            : t('error.description', {
                defaultValue:
                  'Something went wrong. Please try refreshing the page or go back to the home page.',
              })}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleGoBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('error.goBack', { defaultValue: 'Go Back' })}
          </Button>
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {t('error.refresh', { defaultValue: 'Refresh Page' })}
          </Button>
          <Button onClick={handleGoHome} className="gap-2">
            <Home className="h-4 w-4" />
            {t('error.goHome', { defaultValue: 'Go Home' })}
          </Button>
        </div>

        {/* Additional Help Text */}
        <p className="mt-8 text-sm text-muted-foreground">
          {t('error.help', {
            defaultValue: 'If this problem persists, please contact support.',
          })}
        </p>
      </div>
    </div>
  );
};
