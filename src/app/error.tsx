import { Component, ReactNode } from 'react';
import { ErrorPage } from '@/components/pages';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 *
 * Catches and displays errors that occur during rendering.
 * Uses React Error Boundary pattern to catch errors in component tree.
 * Displays error details in development, generic message in production.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          error={this.state.error}
          errorMessage={this.state.error?.message || 'An unexpected error occurred'}
          statusCode={500}
        />
      );
    }

    return this.props.children;
  }
}
