/**
 * Login Page
 *
 * Public auth route - only accessible when user is NOT logged in.
 * Redirects to home if already authenticated (handled by AuthLayout).
 * Layout is automatically applied by the router system.
 */
import { LoginPage } from "@pages";
export default function Page() {
  return <LoginPage />;
}
