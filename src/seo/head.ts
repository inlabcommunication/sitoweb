// Aggiorna <head> nel browser a ogni cambio pagina (titolo, description,
// canonical, Open Graph, Twitter, robots e JSON-LD della pagina).
import type { Seo } from './routes';

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const applySeo = (seo: Seo) => {
  document.title = seo.title;
  setMeta('name', 'description', seo.description);
  setMeta('name', 'robots', seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = seo.canonical;

  setMeta('property', 'og:title', seo.title);
  setMeta('property', 'og:description', seo.description);
  setMeta('property', 'og:url', seo.canonical);
  setMeta('property', 'og:image', seo.image);
  setMeta('name', 'twitter:title', seo.title);
  setMeta('name', 'twitter:description', seo.description);
  setMeta('name', 'twitter:image', seo.image);

  document.head.querySelectorAll('script[data-seo="page"]').forEach((el) => el.remove());
  for (const data of seo.jsonLd) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.dataset.seo = 'page';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }
};
