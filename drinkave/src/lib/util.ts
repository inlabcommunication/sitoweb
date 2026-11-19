export const uid = () =>
  (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, '').slice(0, 20);

/** Normalizza un numero di telefono italiano: solo cifre, con prefisso internazionale (+39 di default). */
export function normalizzaTelefono(input: string): string {
  let t = input.replace(/[^\d+]/g, '');
  if (t.startsWith('00')) t = '+' + t.slice(2);
  if (!t.startsWith('+')) t = '+39' + t;
  return t;
}

export function telefonoValido(input: string): boolean {
  const t = normalizzaTelefono(input);
  return /^\+\d{8,15}$/.test(t);
}

export function emailValida(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.trim());
}

export function formatData(ms: number): string {
  return new Date(ms).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDataOra(ms: number): string {
  return new Date(ms).toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}
