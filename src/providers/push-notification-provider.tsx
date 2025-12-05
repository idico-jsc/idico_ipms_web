import { PropsWithChildren, createContext, useContext } from "react";
import { usePushNotifications } from "@/features/push-notifications/hooks/use-push-notifications";

interface PushNotificationContextValue {
  token: string | null;
  permission: NotificationPermission;
  isLoading: boolean;
  error: string | null;
  isSubscribed: boolean;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  sendTestNotification: () => Promise<void>;
  isSupported: boolean;
}

const PushNotificationContext = createContext<PushNotificationContextValue | undefined>(undefined);

export const usePushNotificationContext = () => {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error('usePushNotificationContext must be used within PushNotificationProvider');
  }
  return context;
};

export type PushNotificationProviderProps = PropsWithChildren;

export const PushNotificationProvider = ({ children }: PushNotificationProviderProps) => {
  const pushNotifications = usePushNotifications();

  return (
    <PushNotificationContext.Provider value={pushNotifications}>
      {children}
    </PushNotificationContext.Provider>
  );
};
