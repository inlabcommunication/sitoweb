import type { Membro } from './types';

const K = 'drinkave.membro';

export function getMembro(): Membro | null {
  try {
    const raw = localStorage.getItem(K);
    return raw ? (JSON.parse(raw) as Membro) : null;
  } catch {
    return null;
  }
}

export function setMembro(m: Membro | null) {
  try {
    if (m) localStorage.setItem(K, JSON.stringify(m));
    else localStorage.removeItem(K);
  } catch {
    /* storage non disponibile */
  }
}
