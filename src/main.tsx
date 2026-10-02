import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './fonts.css';
import './index.css';

// Dopo un nuovo deploy i file delle pagine caricate al momento (blog, casi
// studio, privacy, dashboard) cambiano nome: chi aveva il sito già aperto non
// riesce a scaricarli e vedeva una pagina nera finché non ricaricava
// (segnalazione analista 02/10). Vite segnala l'errore con vite:preloadError:
// ricarichiamo la pagina di destinazione, che arriva con i file nuovi. Al
// massimo una volta ogni 10 secondi, per non entrare mai in un ciclo: se
// ricapita subito, l'errore passa all'ErrorBoundary.
window.addEventListener('vite:preloadError', (event) => {
  let last = 0;
  try { last = Number(sessionStorage.getItem('inlab_chunk_reload')) || 0; } catch { /* storage non disponibile */ }
  if (Date.now() - last < 10_000) return;
  // senza storage non si può evitare il ciclo: niente ricarica, decide l'ErrorBoundary
  try { sessionStorage.setItem('inlab_chunk_reload', String(Date.now())); } catch { return; }
  event.preventDefault();
  window.location.reload();
});

// La dashboard (con Firebase Auth + Firestore completo) è in un chunk separato:
// i visitatori del sito non la scaricano mai.
const AdminApp = lazy(() => import('./admin/AdminApp.tsx').then((m) => ({ default: m.AdminApp })));

// ════════════════════════════════════════════════════════════════
// Routing top-level: /admin → dashboard, tutto il resto → sito.
// I vecchi link /#/admin vengono portati su /admin.
// ════════════════════════════════════════════════════════════════

const isAdminRoute = () => {
  if (window.location.hash.startsWith('#/admin')) window.history.replaceState(null, '', '/admin');
  return window.location.pathname.startsWith('/admin');
};

const Root = () => {
  const [admin, setAdmin] = useState(isAdminRoute());
  useEffect(() => {
    const update = () => setAdmin(isAdminRoute());
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('popstate', update);
    };
  }, []);
  return admin
    ? <Suspense fallback={null}><AdminApp /></Suspense>
    : <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Root />
    </ErrorBoundary>
  </StrictMode>,
);
