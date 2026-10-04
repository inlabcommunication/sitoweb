// Tipo e ID di un post Instagram dal codice di incorporamento o dal link.
export const instagramPost = (embed?: string): { kind: 'reel' | 'p' | 'tv'; id: string } | null => {
  const m = (embed || '').match(/instagram\.com\/(?:[\w.]+\/)?(reels?|p|tv)\/([\w-]+)/i);
  if (!m) return null;
  const k = m[1].toLowerCase();
  return { kind: k === 'p' ? 'p' : k === 'tv' ? 'tv' : 'reel', id: m[2] };
};

const RESERVED = new Set(['reel', 'reels', 'p', 'tv', 'explore', 'stories', 'accounts', 'about', 'developer', 'legal']);

/** Username del proprietario del post: "(@nome)" nel codice di incorporamento o instagram.com/nome/reel/… */
export const instagramAccount = (embed?: string): string | null => {
  const e = embed || '';
  const a = e.match(/\(@([A-Za-z0-9._]{1,30})\)/);
  if (a) return a[1].toLowerCase();
  const b = e.match(/instagram\.com\/([A-Za-z0-9._]{1,30})\/(?:reels?|p|tv)\//i);
  return b && !RESERVED.has(b[1].toLowerCase()) ? b[1].toLowerCase() : null;
};
