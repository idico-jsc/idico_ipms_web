import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Button } from "@/components/atoms";
import { AlertTriangle, Home, RefreshCw, ArrowLeft } from "lucide-react";
import { LanguageSwitcher } from "@molecules";
import { ROUTES } from "@/constants/routes";

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
  errorMessage = "An unexpected error occurred",
  statusCode = 500,
  showDetails = false,
}: ErrorPageProps) => {
  const { t } = useTranslation(["buttons", "messages", "pages"]);
  const navigate = useNavigate();
  const isDev = import.meta.env.DEV;

  const errorDetails = isDev && error?.stack ? error.stack : "";

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <LanguageSwitcher className="absolute top-4 right-4" />
      <div className="text-center">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-destructive/10 rounded-full p-4">
            <AlertTriangle className="text-destructive h-16 w-16" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-foreground mb-4 text-2xl font-semibold">
          {t("messages:error.general.title", { defaultValue: "Something went wrong!" })}
        </h2>

        {/* Error Message */}
        <h4 className="text-muted-foreground mb-4 text-lg font-semibold">
          {t("messages:error.general.message", {
            defaultValue: "We apologize for the inconvenience.",
          })}
        </h4>

        {/* Error Details (Dev only or when showDetails is true) */}
        {(isDev || showDetails) && errorDetails && (
          <div className="text-left mt-10">
            {/* Status Code */}
            {statusCode && (
              <p>
                <span className="text-destructive mb-4 text-base font-bold">
                  [Error {statusCode}]
                </span>
                <span className="ml-2">{errorMessage}</span>
              </p>
            )}
            <details className="mt-6 text-left">
              <summary className="text-muted-foreground hover:text-foreground mb-2 cursor-pointer text-sm">
                {t("pages:errorPage.showDetails", { defaultValue: "Show error details" })}
                {isDev && " (dev only)"}
              </summary>
              <pre className="bg-muted max-h-60 overflow-auto rounded-lg p-4 text-left text-xs">
                {errorDetails}
              </pre>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={handleGoBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("buttons:goBack", { defaultValue: "Go Back" })}
          </Button>
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            {t("buttons:refresh", { defaultValue: "Refresh Page" })}
          </Button>
          <Button onClick={handleGoHome} className="gap-2">
            <Home className="h-4 w-4" />
            {t("buttons:goHome", { defaultValue: "Go Home" })}
          </Button>
        </div>
      </div>
    </div>
  );
};
