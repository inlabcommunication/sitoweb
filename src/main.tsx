import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Sito e pannello admin in file separati: chi visita il sito non scarica il codice dell'admin.
const App = lazy(() => import('./App.tsx'));
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
  return <Suspense fallback={null}>{admin ? <AdminApp /> : <App />}</Suspense>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
