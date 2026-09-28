import { initializeApp, getApps } from 'firebase/app';
// Firestore Lite (solo REST, niente listener realtime): molto più leggera della versione completa.
// Il sito non usa onSnapshot, quindi basta questa sia per il sito pubblico sia per l'admin.
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;
export const app = isConfigured && !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = isConfigured ? getFirestore(app) : null;
export const isFirebaseConfigured = () => isConfigured;
