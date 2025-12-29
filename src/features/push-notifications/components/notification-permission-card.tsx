
import { Button } from '@atoms/button';
import { usePushNotificationContext } from '@/providers/push-notification-provider';
import { Card } from '@atoms/card';
import { Bell, BellOff, Loader2 } from 'lucide-react';

/**
 * Notification Permission Card Component
 * Displays current notification status and allows users to subscribe/unsubscribe
 */
export function NotificationPermissionCard() {
  const {
    isLoading,
    error,
    isSubscribed,
    subscribe,
    unsubscribe,
    isSupported,
  } = usePushNotificationContext();

  if (!isSupported) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <BellOff className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <h3 className="font-semibold">Notifications Not Supported</h3>
            <p className="text-sm text-muted-foreground">
              Push notifications are not supported on this device
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        {isSubscribed ? (
          <Bell className="h-5 w-5 text-green-600" />
        ) : (
          <BellOff className="h-5 w-5 text-muted-foreground" />
        )}

        <div className="flex-1">
          <h3 className="font-semibold">Push Notifications</h3>
          <p className="text-sm text-muted-foreground">
            {isSubscribed
              ? 'You are subscribed to push notifications'
              : 'Get notified about important updates'}
          </p>
          {error && (
            <p className="text-sm text-destructive mt-1">{error}</p>
          )}
        </div>

        <Button
          onClick={isSubscribed ? unsubscribe : subscribe}
          disabled={isLoading}
          variant={isSubscribed ? 'outline' : 'default'}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isSubscribed ? (
            'Unsubscribe'
          ) : (
            'Enable'
          )}
        </Button>
      </div>
    </Card>
  );
}
