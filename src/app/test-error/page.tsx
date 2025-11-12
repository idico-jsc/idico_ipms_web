/**
 * Test Error Page
 *
 * This page intentionally throws an error to test the ErrorBoundary component.
 * Only available in development mode for testing purposes.
 *
 * To test:
 * 1. Run app in dev mode: npm run dev
 * 2. Navigate to: /test-error
 * 3. You should see the ErrorBoundary page with error details
 */

export default function TestErrorPage() {
  // This will throw an error and be caught by the ErrorBoundary
  throw new Error('This is a test error to demonstrate the ErrorBoundary component!');

  // This code will never execute
  return (
    <div>
      <h1>This should not be visible</h1>
    </div>
  );
}
