import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Temporary placeholder configuration - replace with actual values
const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
  authDomain: "FIREBASE_AUTH_DOMAIN_PLACEHOLDER",
  projectId: "FIREBASE_PROJECT_ID_PLACEHOLDER",
  storageBucket: "FIREBASE_STORAGE_BUCKET_PLACEHOLDER",
  messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID_PLACEHOLDER",
  appId: "FIREBASE_APP_ID_PLACEHOLDER"
};

console.log("Initializing Firebase with config:", firebaseConfig);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);