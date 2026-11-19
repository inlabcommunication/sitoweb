import { useEffect, useState } from 'react';

/** Router minimale basato sull'hash (#/menu, #/news/123, #/gestione/clienti…). */
export function useRoute(): string[] {
  const leggi = () => (window.location.hash.replace(/^#\/?/, '').split('?')[0] || '').split('/').filter(Boolean);
  const [parti, setParti] = useState(leggi);
  useEffect(() => {
    const on = () => {
      setParti(leggi());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return parti;
}

export const vai = (path: string) => {
  window.location.hash = path.startsWith('#') ? path : '#' + path;
};
