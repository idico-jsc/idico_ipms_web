import { useEffect, useState } from "react";
import {
  askUserPermission,
  createNotificationSubscription,
  getUserSubscription,
  isPushNotificationSupported,
} from "@/utils";

export const usePushNotification = () => {
  //to manage the user consent: Notification.permission is a JavaScript native function that return the current state of the permission
  //We initialize the userConsent with that value
  const [userSubscription, setUserSubscription] = useState<PushSubscription | null>(null);
  //if the push notifications are supported, registers the service worker
  //this effect runs only the first render

  const getSubscription = async () => {
    const existingSubscription = await getUserSubscription();
    console.log("existingSubscription", existingSubscription);
    if (!existingSubscription) {
      const newSubscription = await createNotificationSubscription();
      console.log("newSubscription", newSubscription);
      setUserSubscription(newSubscription);
      return;
    }
    setUserSubscription(existingSubscription);
  };

  useEffect(() => {
    askUserPermission().then((consent) => {
      if (consent !== "granted") {
        console.log("Permission not granted for Notification");
      }
    });
    getSubscription();
  }, []);

  return { isPushNotificationSupported, userSubscription };
};
