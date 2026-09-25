// SDK Firebase completo (Auth + Firestore). Usato solo dalla dashboard /admin,
// che viene caricata in un chunk separato.
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

const isConfigured = isFirebaseConfigured();
const app = isConfigured && !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = isConfigured ? getAuth(app) : null;
export const db = isConfigured ? getFirestore(app) : null;
export { isFirebaseConfigured };
