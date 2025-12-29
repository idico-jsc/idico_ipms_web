import { Button } from '@atoms/button';
import { usePushNotificationContext } from '@/providers/push-notification-provider';
import { Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Test Notification Button Component
 * Allows users to send a test notification to themselves
 */
export function TestNotificationButton() {
  const { sendTestNotification, isSubscribed } = usePushNotificationContext();
  const [isSending, setIsSending] = useState(false);

  const handleSendTest = async () => {
    setIsSending(true);
    try {
      await sendTestNotification();
      toast.success('Test notification sent! Check your notifications.');
    } catch (error) {
      toast.error('Failed to send test notification');
    } finally {
      setIsSending(false);
    }
  };

  if (!isSubscribed) return null;

  return (
    <Button
      onClick={handleSendTest}
      disabled={isSending}
      variant="outline"
      size="sm"
    >
      {isSending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="h-4 w-4 mr-2" />
          Send Test
        </>
      )}
    </Button>
  );
}
