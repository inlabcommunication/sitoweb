import { useCallback, useEffect, useState } from 'react';

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const [caricamento, setCaricamento] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fn, deps);
  const ricarica = useCallback(() => {
    setCaricamento(true);
    setErrore(null);
    run()
      .then(setData)
      .catch((e) => {
        console.error(e);
        setErrore(e instanceof Error && e.message ? e.message : 'Qualcosa è andato storto.');
      })
      .finally(() => setCaricamento(false));
  }, [run]);
  useEffect(ricarica, [ricarica]);
  return { data, errore, caricamento, ricarica, setData };
}
