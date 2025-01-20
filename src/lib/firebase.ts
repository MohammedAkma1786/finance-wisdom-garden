import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const FIREBASE_CONFIG_KEY = 'firebase_config';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const getStoredFirebaseConfig = (): FirebaseConfig | null => {
  const stored = localStorage.getItem(FIREBASE_CONFIG_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const setFirebaseConfig = (config: FirebaseConfig) => {
  localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
  window.location.reload(); // Reload to reinitialize Firebase with new config
};

let app: FirebaseApp | null = null;
let firebaseConfig = getStoredFirebaseConfig();

if (firebaseConfig) {
  try {
    app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    localStorage.removeItem(FIREBASE_CONFIG_KEY);
  }
}

export const auth = app ? getAuth(app) : null;
export const isFirebaseConfigured = Boolean(app);