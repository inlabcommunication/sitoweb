// Numeri dell'agenzia: modificabili da dashboard → Home → Numeri (content.stats),
// con valori predefiniti in constants.ts. Usati da hero (primi 3), sezione
// "I numeri" e pagine Studio / Servizi / città.
import { useContent } from '../lib/content';

export type AgencyStat = { value: number; prefix?: string; suffix?: string; label: string; short?: string };

/** 3200000 → "3.2M", 840000 → "840K", 47 → "47" */
export const formatNumber = (v: number): string => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}K`;
  return String(v);
};

export const useAgencyStats = () => {
  const content = useContent() as any;
  const list: any[] = Array.isArray(content.stats) ? content.stats : [];
  return list
    .map((s) => ({
      value: Number(s.value) || Number(String(s.num || '').replace(/[^\d.]/g, '')) || 0,
      prefix: s.prefix || '',
      suffix: s.suffix || '',
      label: String(s.label || ''),
      short: String(s.short || s.label || '').toLowerCase(),
    }))
    .filter((s) => s.label)
    .map((s) => ({ ...s, display: `${s.prefix}${formatNumber(s.value)}${s.suffix}` }));
};
