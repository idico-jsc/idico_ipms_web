import { useRouteError, isRouteErrorResponse } from 'react-router';
import { ErrorPage } from '@/components/pages';

/**
 * Error Boundary Component
 *
 * Catches and displays routing errors using React Router's error handling.
 * Now works properly with createBrowserRouter data router context.
 * Displays error details in development, generic message in production.
 */
export default function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred';
  let statusCode = 500;
  let errorObject: Error | null = null;

  // Parse error based on type
  if (isRouteErrorResponse(error)) {
    // HTTP error response (404, 500, etc.)
    statusCode = error.status;
    errorMessage = error.statusText || errorMessage;
    if (error.data?.message) {
      errorMessage = error.data.message;
    }
  } else if (error instanceof Error) {
    // JavaScript error
    errorMessage = error.message;
    errorObject = error;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <ErrorPage
      error={errorObject}
      errorMessage={errorMessage}
      statusCode={statusCode}
    />
  );
}
