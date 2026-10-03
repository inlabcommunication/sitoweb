// Funzioni di animazione di motion in un file caricato dopo il primo render:
// usato da LazyMotion nel sito (App.tsx) e nella dashboard (main.tsx).
export const loadMotionFeatures = () => import('./motionFeatures').then((r) => r.default);
