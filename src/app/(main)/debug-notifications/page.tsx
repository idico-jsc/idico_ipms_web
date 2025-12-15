import { useState, useEffect } from 'react';
import { Button } from '@/components/atoms/button';
import { Card } from '@/components/atoms/card';
import { PushNotificationService } from '@/features/push-notifications/services/push-notification.service';
import { FirebaseMessagingService } from '@/features/push-notifications/services/firebase-messaging.service';
import { NotificationPermissionCard, TestNotificationButton } from '@/features/push-notifications';
import { Copy, CheckCircle, XCircle, AlertCircle, Smartphone, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { isNative, getPlatform } from '@/utils/capacitor';

/**
 * Debug Notifications Page
 * Tool for debugging Firebase Cloud Messaging setup
 */
export default function DebugNotificationsPage() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<{
    isSupported: boolean;
    permission: NotificationPermission;
    serviceWorkerSupported: boolean;
    serviceWorkerRegistered: boolean;
    messagingInitialized: boolean;
    vapidKey: string | undefined;
  } | null>(null);

  useEffect(() => {
    checkDebugInfo();
  }, []);

  const checkDebugInfo = async () => {
    const native = isNative();

    const info = {
      isSupported: native ? true : FirebaseMessagingService.isSupported(),
      permission: native ? 'default' as NotificationPermission : Notification.permission,
      serviceWorkerSupported: !native && 'serviceWorker' in navigator,
      serviceWorkerRegistered: false,
      messagingInitialized: false,
      vapidKey: import.meta.env.VITE_FIREBASE_PUBLIC_KEY,
    };

    // Check if service worker is registered (web only)
    if (!native && 'serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      info.serviceWorkerRegistered = registrations.length > 0;
    }

    // Check if messaging is initialized
    try {
      const initialized = await PushNotificationService.initialize();
      info.messagingInitialized = !!initialized;
    } catch (err) {
      console.error('Push notification init error:', err);
    }

    setDebugInfo(info);

    // Auto-load token from localStorage
    const storedToken = localStorage.getItem('fcm-token');
    if (storedToken) {
      setFcmToken(storedToken);
    }
  };

  const getTokenManually = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const platform = getPlatform();
      console.log(`🔄 Starting push notification token retrieval on ${platform}...`);

      // Use unified service
      const token = await PushNotificationService.requestPermissionAndGetToken();

      if (!token) {
        throw new Error('Failed to get push notification token');
      }

      console.log(`✅ Push Token (${platform}):`, token);
      setFcmToken(token);

      // Save to localStorage
      localStorage.setItem('fcm-token', token);

      toast.success(`Push token retrieved successfully on ${platform}!`);

      // Refresh debug info
      await checkDebugInfo();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get token';
      setError(errorMessage);
      console.error('❌ Error:', err);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToken = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken);
      toast.success('Token copied to clipboard!');
    }
  };

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  return (
    <div className="container mx-auto space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">Push Notifications Debug</h1>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {isNative() ? (
              <>
                <Smartphone className="h-4 w-4" />
                {getPlatform().toUpperCase()}
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                WEB
              </>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">
          Diagnose and test {isNative() ? 'Capacitor Push Notifications' : 'Firebase Cloud Messaging'} setup
        </p>
      </div>

      {/* Debug Info Card */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        {debugInfo && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Push Notifications Supported</span>
              <StatusIcon status={debugInfo.isSupported} />
            </div>
            {!isNative() && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Service Worker Supported</span>
                  <StatusIcon status={debugInfo.serviceWorkerSupported} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Service Worker Registered</span>
                  <StatusIcon status={debugInfo.serviceWorkerRegistered} />
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm">{isNative() ? 'Capacitor Push Initialized' : 'Firebase Messaging Initialized'}</span>
              <StatusIcon status={debugInfo.messagingInitialized} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Notification Permission</span>
              <span className={`text-sm font-medium ${
                debugInfo.permission === 'granted' ? 'text-green-600' :
                debugInfo.permission === 'denied' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {debugInfo.permission}
              </span>
            </div>
            {!isNative() && (
              <div className="border-t pt-3">
                <div className="text-sm text-muted-foreground">VAPID Key (Web Only)</div>
                <div className="text-xs font-mono bg-muted p-2 rounded mt-1 break-all">
                  {debugInfo.vapidKey || 'Not configured'}
                </div>
              </div>
            )}
            {isNative() && (
              <div className="border-t pt-3">
                <div className="text-sm text-muted-foreground">Platform Info</div>
                <div className="text-xs bg-muted p-2 rounded mt-1">
                  <div><strong>Platform:</strong> {getPlatform()}</div>
                  <div><strong>Package:</strong> com.wellspring.parentportal</div>
                  <div><strong>Push Provider:</strong> Firebase Cloud Messaging (FCM)</div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Push Token Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{isNative() ? 'Push Token' : 'FCM Token'}</h2>
          <Button onClick={getTokenManually} disabled={isLoading}>
            {isLoading ? 'Getting Token...' : 'Get Token'}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Error</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}

        {fcmToken ? (
          <div>
            <div className="bg-muted p-4 rounded-lg mb-4">
              <div className="text-xs text-muted-foreground mb-2">Your {isNative() ? 'Push' : 'FCM'} Token:</div>
              <div className="font-mono text-sm break-all">{fcmToken}</div>
            </div>
            <Button onClick={copyToken} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy Token
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No token yet. Click "Get Token" to retrieve your push notification token.</p>
          </div>
        )}
      </Card>

      {/* Notification Management */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Notification Management</h2>
        <NotificationPermissionCard />
        <div className="mt-4">
          <TestNotificationButton />
        </div>
      </div>

      {/* Instructions */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-950">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Troubleshooting
        </h3>
        <ul className="text-sm space-y-2 ml-7">
          <li>
            <strong>Permission denied:</strong> Check browser settings and allow notifications
          </li>
          <li>
            <strong>Service Worker not registered:</strong> Check console for errors
          </li>
          <li>
            <strong>VAPID key missing:</strong> Add VITE_FIREBASE_PUBLIC_KEY to .env.development
          </li>
          <li>
            <strong>Messaging not initialized:</strong> Check Firebase config in src/config/firebase.ts
          </li>
          <li>
            <strong>Check console logs:</strong> Open DevTools (F12) → Console for detailed errors
          </li>
        </ul>
      </Card>

      {/* Console Logs Helper */}
      <Card className="p-6">
        <h3 className="font-semibold mb-2">Console Commands</h3>
        <div className="space-y-2 text-sm font-mono">
          <div className="bg-muted p-2 rounded">
            <div className="text-xs text-muted-foreground mb-1">Get stored token:</div>
            localStorage.getItem('fcm-token')
          </div>
          <div className="bg-muted p-2 rounded">
            <div className="text-xs text-muted-foreground mb-1">Check permission:</div>
            Notification.permission
          </div>
          <div className="bg-muted p-2 rounded">
            <div className="text-xs text-muted-foreground mb-1">List service workers:</div>
            await navigator.serviceWorker.getRegistrations()
          </div>
        </div>
      </Card>
    </div>
  );
}
