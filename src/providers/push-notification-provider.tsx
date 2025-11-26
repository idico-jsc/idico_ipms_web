import { PropsWithChildren, type FC } from "react";
import { usePushNotification } from "@/hooks";

export type PushNotificationProviderProps = PropsWithChildren & {};

export const PushNotificationProvider: FC<PushNotificationProviderProps> = ({ children }) => {
  const { } = usePushNotification();

  return children;
};
