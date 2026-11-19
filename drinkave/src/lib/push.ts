import { backend } from './backend';
import type { PushResult } from './types';

export function statoNotifiche(): 'attive' | 'negate' | 'da-chiedere' | 'non-supportate' {
  if (!('Notification' in window)) return 'non-supportate';
  if (Notification.permission === 'granted') return 'attive';
  if (Notification.permission === 'denied') return 'negate';
  return 'da-chiedere';
}

export async function attivaNotifiche(): Promise<PushResult> {
  return (await backend()).attivaNotifiche();
}

export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

export const messaggioPush: Record<PushResult, string> = {
  attivate: 'Notifiche attive: ti avviseremo di eventi e novità.',
  negate: 'Notifiche bloccate. Puoi riattivarle dalle impostazioni del browser.',
  'non-supportate': 'Questo browser non supporta le notifiche.',
  errore: 'Non è stato possibile attivare le notifiche. Riprova più tardi.',
};
