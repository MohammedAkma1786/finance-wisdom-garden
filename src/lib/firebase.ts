import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate that all required Firebase config values are present
const validateFirebaseConfig = (config: Record<string, string | undefined>): boolean => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  return requiredFields.every(field => {
    const value = config[field];
    if (!value) {
      console.error(`Missing Firebase config: ${field}`);
      return false;
    }
    return true;
  });
};

let app: FirebaseApp | null = null;
let analytics = null;

if (validateFirebaseConfig(firebaseConfig)) {
  try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  console.error("Firebase configuration is incomplete. Please check your .env file.");
}

export const auth = app ? getAuth(app) : null;
export const isFirebaseConfigured = Boolean(app);