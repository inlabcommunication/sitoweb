import { StrictMode, Suspense, lazy, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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
    <Root />
  </StrictMode>,
);
