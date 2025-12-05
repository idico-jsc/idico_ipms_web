import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";

/**
 * Firebase Configuration
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Connect to emulator in development if enabled
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true' && import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  console.log('🔥 Connected to Firebase Auth Emulator');
}

// Initialize Firebase Messaging (web only)
let messaging: ReturnType<typeof getMessaging> | null = null;

/**
 * Initialize Firebase Cloud Messaging
 * @returns Messaging instance or null if not supported
 */
export const initializeMessaging = async () => {
  // Check if messaging is supported (web only, not in service worker context)
  const supported = await isMessagingSupported();

  if (supported && typeof window !== 'undefined') {
    messaging = getMessaging(app);
    return messaging;
  }

  return null;
};

/**
 * Get the current messaging instance
 * @returns Messaging instance or null if not initialized
 */
export const getMessagingInstance = () => messaging;

export { messaging };
