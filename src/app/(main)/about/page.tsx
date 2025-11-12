import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';

/**
 * About Page
 *
 * Displays information about the application.
 * This is a protected route that requires authentication.
 */
export default function AboutPage() {
  const { t } = useTranslation('pages');

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">About</h1>
          <p className="text-muted-foreground">
            Learn more about this React TypeScript Starter application
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>React TypeScript Starter</CardTitle>
            <CardDescription>
              A modern, production-ready React starter template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>React 18 with TypeScript</li>
                <li>Vite for fast development and building</li>
                <li>React Router for navigation</li>
                <li>Tailwind CSS for styling</li>
                <li>Shadcn/ui for beautiful components</li>
                <li>Authentication with JWT bearer tokens</li>
                <li>Internationalization (i18n)</li>
                <li>Dark mode support</li>
                <li>Capacitor for mobile app development</li>
                <li>PWA support</li>
                <li>Centralized URL and route management</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Architecture</h3>
              <p className="text-sm text-muted-foreground">
                This application follows a feature-based architecture with clear separation of concerns.
                Components are organized using Atomic Design principles (atoms, molecules, organisms).
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Tech Stack</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="p-2 border rounded">
                  <strong>Frontend:</strong> React + TypeScript
                </div>
                <div className="p-2 border rounded">
                  <strong>Styling:</strong> Tailwind CSS
                </div>
                <div className="p-2 border rounded">
                  <strong>Build Tool:</strong> Vite
                </div>
                <div className="p-2 border rounded">
                  <strong>Router:</strong> React Router
                </div>
                <div className="p-2 border rounded">
                  <strong>State:</strong> Zustand
                </div>
                <div className="p-2 border rounded">
                  <strong>UI:</strong> Shadcn/ui
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Learn how to use and extend this starter template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>Check out the following documentation files in the project root:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><code>ARCHITECTURE.md</code> - Project structure and conventions</li>
                <li><code>AUTH_GUIDE.md</code> - Authentication implementation</li>
                <li><code>ROUTING_GUIDE.md</code> - URL and route management</li>
                <li><code>I18N_GUIDE.md</code> - Internationalization setup</li>
                <li><code>CREATE_PAGE.md</code> - How to create new pages</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
