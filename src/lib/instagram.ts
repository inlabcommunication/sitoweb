// Tipo e ID di un post Instagram dal codice di incorporamento o dal link.
export const instagramPost = (embed?: string): { kind: 'reel' | 'p' | 'tv'; id: string } | null => {
  const m = (embed || '').match(/instagram\.com\/(?:[\w.]+\/)?(reels?|p|tv)\/([\w-]+)/i);
  if (!m) return null;
  const k = m[1].toLowerCase();
  return { kind: k === 'p' ? 'p' : k === 'tv' ? 'tv' : 'reel', id: m[2] };
};
