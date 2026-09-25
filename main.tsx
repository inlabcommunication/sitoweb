import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AdminApp } from './admin/AdminApp.tsx';
import './index.css';

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
  return admin ? <AdminApp /> : <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
