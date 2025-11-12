import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@/components/atoms';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found Page
 *
 * Displayed when user navigates to a route that doesn't exist.
 * Features:
 * - Large 404 display
 * - Helpful message
 * - Navigation buttons (Back, Home)
 * - Responsive design
 * - i18n support
 */
export const NotFound = () => {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Number */}
        <h1 className="text-9xl font-bold text-primary">404</h1>

        {/* Title */}
        <h2 className="mt-4 text-3xl font-semibold text-foreground">
          {t('notFound.title', { defaultValue: 'Page Not Found' })}
        </h2>

        {/* Description */}
        <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
          {t('notFound.description', {
            defaultValue:
              "The page you're looking for doesn't exist or has been moved.",
          })}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('notFound.goBack', { defaultValue: 'Go Back' })}
          </Button>
          <Button onClick={handleGoHome} className="gap-2">
            <Home className="h-4 w-4" />
            {t('notFound.goHome', { defaultValue: 'Go Home' })}
          </Button>
        </div>

        {/* Additional Help Text */}
        <p className="mt-8 text-sm text-muted-foreground">
          {t('notFound.help', {
            defaultValue: 'If you believe this is an error, please contact support.',
          })}
        </p>
      </div>
    </div>
  );
};
