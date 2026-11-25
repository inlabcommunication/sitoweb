/**
 * Id di sessione non indovinabile, condiviso da statistiche e chat (chiave inlab_sid).
 * Con l'id di una chat si aggiorna il lead di quella conversazione: per questo non può
 * essere prevedibile come Math.random (audit 24/11, L2). 36 caratteri, entro il limite
 * di 40 delle regole Firestore e dei caratteri accettati da /api/chat.
 */
export const newSessionId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  } catch {
    return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
};
