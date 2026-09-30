// URL Cloudinary ottimizzati per il sito pubblico. Le trasformazioni si
// aggiungono solo agli URL di res.cloudinary.com che non ne hanno già:
// qualsiasi altro URL torna com'è.

const CLD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video)\/upload\/)(.*)$/;

/** Vero se dopo "/upload/" c'è subito la versione (v123…) o il file, cioè nessuna trasformazione. */
function untransformed(rest: string): boolean {
  const first = rest.split('/')[0];
  // una cartella senza versione resta com'è: niente ottimizzazione, ma nessun rischio di rompere l'URL
  return /^v\d+$/.test(first) || !rest.includes('/');
}

function withTransform(url: string, t: string): string {
  const m = CLD.exec(url);
  if (!m || !untransformed(m[2])) return url;
  return `${m[1]}${t}/${m[2]}`;
}

/** Video: formato e qualità automatici, larghezza massima `width` (mai ingrandito). */
export function cldVideo(url: string, width: number): string {
  if (!url.includes('/video/upload/')) return url;
  return withTransform(url, `f_auto,q_auto,w_${width},c_limit`);
}

/** Fotogramma iniziale del video come immagine leggera, da usare come poster. */
export function cldVideoPoster(url: string, width: number): string {
  if (!url.includes('/video/upload/') || !CLD.test(url)) return '';
  const t = withTransform(url, `so_0,f_auto,q_auto,w_${width},c_limit`);
  return t === url ? '' : t.replace(/\.(mp4|mov|webm|m4v)(\?.*)?$/i, '.jpg');
}

/**
 * Immagine: formato e qualità automatici, larghezza massima `width` (mai
 * ingrandita). Le versioni trasformate da Cloudinary non contengono i
 * metadati EXIF (per esempio la posizione GPS delle foto da telefono).
 * Larghezze usate: loghi 400, card 900, immagini a tutta pagina 1600.
 */
export function cld(url: string | undefined, width: number): string {
  if (!url) return '';
  if (!url.includes('/image/upload/')) return url;
  return withTransform(url, `f_auto,q_auto,w_${width},c_limit`);
}
