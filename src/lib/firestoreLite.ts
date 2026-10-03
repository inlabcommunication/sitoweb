// Firestore "lite" caricato on-demand per il sito pubblico (contenuti, analytics,
// form contatti): niente Auth, niente listener realtime → molto più leggero
// dell'SDK completo e fuori dal bundle iniziale.
import type { Firestore } from 'firebase/firestore/lite';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

let dbPromise: Promise<Firestore | null> | null = null;

// Firestore parte solo dopo il caricamento della pagina, quando il browser è
// libero: i contenuti sono già nell'HTML (blocco #site-content), quindi non
// serve rubare banda alla cover e ai file della pagina (richiesta Performance
// 02/10: ~70 KB in meno nel primo secondo).
// Al massimo ~3 s dall'avvio comunque: se il load tarda (video, rete lenta) le
// visite brevi verrebbero perse dalle statistiche (nota dell'analista 03/10).
const MAX_WAIT_MS = 3000;
const afterLoad = () => new Promise<void>((resolve) => {
  if (typeof window === 'undefined') return resolve();
  setTimeout(resolve, MAX_WAIT_MS);
  const idle = () => ('requestIdleCallback' in window
    ? (window as any).requestIdleCallback(() => resolve(), { timeout: 2000 })
    : setTimeout(resolve, 1));
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
});

export const getLiteDb = (): Promise<Firestore | null> => {
  if (!isFirebaseConfigured()) return Promise.resolve(null);
  if (!dbPromise) {
    dbPromise = afterLoad()
      .then(() => Promise.all([import('firebase/app'), import('firebase/firestore/lite')]))
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
