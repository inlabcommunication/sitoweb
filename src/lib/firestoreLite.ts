// Firestore "lite" caricato on-demand per il sito pubblico (contenuti, analytics,
// form contatti): niente Auth, niente listener realtime → molto più leggero
// dell'SDK completo e fuori dal bundle iniziale.
import type { Firestore } from 'firebase/firestore/lite';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

let dbPromise: Promise<Firestore | null> | null = null;

export const getLiteDb = (): Promise<Firestore | null> => {
  if (!isFirebaseConfigured()) return Promise.resolve(null);
  if (!dbPromise) {
    dbPromise = Promise.all([import('firebase/app'), import('firebase/firestore/lite')])
      .then(([{ initializeApp, getApps }, { getFirestore }]) => {
        const app = getApps()[0] ?? initializeApp(firebaseConfig);
        return getFirestore(app);
      })
      .catch((e) => {
        console.warn('[firebase] caricamento fallito', e);
        dbPromise = null;
        return null;
      });
  }
  return dbPromise;
};

export const liteFirestore = () => import('firebase/firestore/lite');
