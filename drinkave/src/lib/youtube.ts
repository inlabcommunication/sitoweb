/** Estrae l'ID video da qualunque link YouTube (watch, youtu.be, shorts, live, embed) o da un ID nudo. */
export function youtubeId(url: string): string | null {
  const s = url.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s.startsWith('http') ? s : 'https://' + s);
    const host = u.hostname.replace(/^www\.|^m\./, '');
    if (host === 'youtu.be') return clean(u.pathname.slice(1));
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = u.searchParams.get('v');
      if (v) return clean(v);
      const m = u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/);
      if (m) return m[1];
    }
  } catch {
    /* link non valido */
  }
  return null;
}

function clean(id: string): string | null {
  const m = id.match(/^[\w-]{11}/);
  return m ? m[0] : null;
}

export const youtubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

/** Player incorporato: resta dentro l'app (niente uscita su YouTube). */
export const youtubeEmbed = (id: string, autoplay = false) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1${autoplay ? '&autoplay=1' : ''}`;
