import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// La dashboard (con Firebase Auth + Firestore completo) è in un chunk separato:
// i visitatori del sito non la scaricano mai.
const AdminApp = lazy(() => import('./admin/AdminApp.tsx').then((m) => ({ default: m.AdminApp })));

// ════════════════════════════════════════════════════════════════
// Routing top-level: /admin → dashboard, tutto il resto → sito
// Usa hash (#/admin) per compatibilità con hosting statico.
// ════════════════════════════════════════════════════════════════

const isAdminRoute = () => {
  const h = window.location.hash || '';
  const p = window.location.pathname || '';
  return h.startsWith('#/admin') || p.startsWith('/admin');
};

const Root = () => {
  const [admin, setAdmin] = useState(isAdminRoute());
  useEffect(() => {
    const update = () => setAdmin(isAdminRoute());
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
    };
  }, []);
  return admin
    ? <Suspense fallback={null}><AdminApp /></Suspense>
    : <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
