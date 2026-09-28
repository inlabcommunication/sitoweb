// Ottimizzazione automatica dei media su Cloudinary: formato moderno (webp/avif, webm),
// qualità automatica e larghezza massima, così il browser scarica file molto più leggeri.
// Gli URL non Cloudinary, o che hanno già delle trasformazioni, restano invariati.

const UPLOAD_RE = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/)(.*)$/;

const hasTransform = (rest: string) => {
  const first = rest.split('/')[0];
  return !/^v\d+$/.test(first) && /[a-z]{1,3}_[^/]+/.test(first) && rest.includes('/');
};

export const cld = (url: string | undefined | null, width = 1200): string => {
  if (!url) return url ?? '';
  const m = url.match(UPLOAD_RE);
  if (!m || hasTransform(m[2])) return url;
  return `${m[1]}f_auto,q_auto,w_${width},c_limit/${m[2]}`;
};

/** Primo fotogramma del video come immagine leggera, da usare come poster. */
export const cldPoster = (url: string | undefined | null, width = 900): string | undefined => {
  if (!url) return undefined;
  const m = url.match(UPLOAD_RE);
  if (!m || !url.includes('/video/upload/') || hasTransform(m[2])) return undefined;
  return `${m[1]}so_0,f_auto,q_auto,w_${width},c_limit/${m[2].replace(/\.[a-z0-9]+$/i, '.jpg')}`;
};
