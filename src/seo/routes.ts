// Registro SEO: titolo, descrizione, canonical e dati strutturati per ogni
// pagina. Usato sia dal browser (aggiorna <head> a ogni cambio pagina) sia
// dallo script di build che genera l'HTML statico, la sitemap e robots.txt.
// Nessun import di React qui: deve poter girare anche in Node.

import { WEBSITE_CONTENT } from '../constants';

/** Dominio del sito. Impostalo su Vercel con VITE_SITE_URL (es. https://www.inlabcommunication.it). */
export const SITE_URL = (
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SITE_URL) ||
  (typeof process !== 'undefined' && (process.env.VITE_SITE_URL || process.env.SITE_URL)) ||
  'https://sitoweb-beta.vercel.app'
).replace(/\/+$/, '');

export const BRAND = 'InLab Communication';
export const DEFAULT_OG_IMAGE = '/og-image.png';

export const BUSINESS = {
  name: BRAND,
  email: 'inlab.communication@gmail.com',
  telephone: '+393295654319',
  city: 'Castellaneta',
  region: 'Puglia',
  sameAs: [
    'https://www.instagram.com/inlab.communication/',
    'https://www.facebook.com/inlab.communication',
    'https://www.linkedin.com/company/inlab-communication/',
  ],
};

export const CITIES = ['Taranto', 'Palagiano', 'Palagianello', 'Massafra', 'Mottola', 'Castellaneta', 'Laterza', 'Ginosa'];

export const SERVICES_SEO = [
  { slug: 'gestione-social', label: 'Gestione Social', keyword: 'gestione social media',
    description: 'Gestione social media professionale per aziende: strategia, piano editoriale, contenuti, reel e community su Instagram, Facebook, TikTok e LinkedIn.' },
  { slug: 'meta-ads', label: 'Meta Ads', keyword: 'campagne Meta Ads',
    description: 'Campagne Meta Ads su Facebook e Instagram progettate per generare contatti e vendite: targeting, creatività, test A/B e report chiari.' },
  { slug: 'siti-web', label: 'Siti Web & Web App', keyword: 'realizzazione siti web',
    description: 'Realizzazione siti web, e-commerce e landing page veloci, ottimizzati SEO e pensati per portare clienti: design su misura, sviluppo e gestione.' },
  { slug: 'automazioni-ai', label: 'Automazioni AI', keyword: 'automazioni e chatbot AI',
    description: 'Chatbot, automazioni e workflow con intelligenza artificiale per risparmiare tempo, gestire i lead e far lavorare il tuo brand 24/7.' },
  { slug: 'shooting', label: 'Foto & Shooting', keyword: 'shooting fotografico',
    description: 'Shooting fotografici professionali per brand, prodotti, food ed eventi: immagini curate per social, sito web e campagne.' },
  { slug: 'video', label: 'Video & Reels', keyword: 'video e reel per social',
    description: 'Produzione video e reel per social: idea, riprese, montaggio e caption. Contenuti che le persone guardano davvero, fino a milioni di views organiche.' },
  { slug: 'branding', label: 'Branding & Identità', keyword: 'branding e identità visiva',
    description: 'Branding e identità visiva: nome, logo, palette e tono di voce per un brand riconoscibile e coerente su ogni canale.' },
];

const CASES = [
  { id: 'paresteta', title: 'Paresteta: dal rebranding all\'inaugurazione',
    description: 'Caso studio Paresteta: campagna in 5 fasi tra teaser, QR code, video lancio e attività offline per trasformare un cambio insegna in un evento locale.' },
  { id: 'ricciardi', title: 'Studio Dentistico Ricciardi: sito web e lead generation',
    description: 'Caso studio Studio Dentistico Ricciardi: nuovo sito Lumina, campagne di lead generation e social per trasformare la fiducia online in prenotazioni.' },
];

export type Seo = {
  path: string;
  title: string;
  description: string;
  canonical: string;
  image: string;
  noindex?: boolean;
  jsonLd: object[];
  /** priorità/frequenza per la sitemap (assente = non in sitemap) */
  sitemap?: { priority: number; changefreq: 'weekly' | 'monthly' };
};

const abs = (path: string) => SITE_URL + (path === '/' ? '/' : path);
const clip = (s: string, n = 160) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

const orgRef = { '@id': `${SITE_URL}/#organization` };

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': `${SITE_URL}/#organization`,
  name: BRAND,
  description: 'Agenzia di comunicazione con sede a Castellaneta (Taranto): gestione social, video e reel, Meta Ads, siti web, branding e automazioni AI per aziende in Puglia e non solo.',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/icon-512.png`,
  image: abs(DEFAULT_OG_IMAGE),
  email: BUSINESS.email,
  telephone: BUSINESS.telephone,
  address: { '@type': 'PostalAddress', addressLocality: BUSINESS.city, postalCode: '74011', addressRegion: 'TA', addressCountry: 'IT' },
  areaServed: [{ '@type': 'AdministrativeArea', name: 'Puglia' }, { '@type': 'Country', name: 'Italia' }],
  sameAs: BUSINESS.sameAs,
  knowsAbout: SERVICES_SEO.map((s) => s.label),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servizi di comunicazione digitale',
    itemListElement: SERVICES_SEO.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.label, url: abs('/' + s.slug) },
    })),
  },
});

const breadcrumb = (items: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'], ...items].map(([name, path], i) => ({
    '@type': 'ListItem', position: i + 1, name, item: abs(path),
  })),
});

const webPage = (path: string, title: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': abs(path) + '#webpage',
  url: abs(path),
  name: title,
  description,
  inLanguage: 'it-IT',
  isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: BRAND },
  about: orgRef,
});

const clients = () => ((WEBSITE_CONTENT as any).clients?.items || []) as any[];

const page = (path: string, title: string, description: string, extra: Partial<Seo> = {}, crumbs?: [string, string][]): Seo => {
  const desc = clip(description);
  return {
    path,
    title,
    description: desc,
    canonical: abs(path),
    image: abs(DEFAULT_OG_IMAGE),
    ...extra,
    jsonLd: [webPage(path, title, desc), ...(crumbs ? [breadcrumb(crumbs)] : []), ...(extra.jsonLd || [])],
  };
};

/** Tutte le pagine indicizzabili (per sitemap e prerender). */
export const listRoutes = (): string[] => [
  '/', '/servizi', '/chi-siamo', '/casi-studio', '/contatti',
  ...SERVICES_SEO.map((s) => '/' + s.slug),
  ...SERVICES_SEO.flatMap((s) => CITIES.map((c) => `/${s.slug}-${c.toLowerCase()}`)),
  ...CASES.map((c) => '/casi-studio/' + c.id),
  ...clients().map((c) => '/cliente/' + c.id),
];

export const getSeo = (rawPath: string): Seo => {
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : '/';

  if (path === '/') {
    return page('/', `${BRAND} | Agenzia di comunicazione in Puglia`,
      'Agenzia di comunicazione con sede a Castellaneta (TA): social media, video e reel, Meta Ads, siti web e branding per aziende in Puglia e non solo.',
      { sitemap: { priority: 1, changefreq: 'weekly' } }); // i dati dell'agenzia sono già nello script "org" di index.html
  }
  if (path === '/servizi') {
    return page(path, `Servizi di comunicazione digitale | ${BRAND}`,
      'Gestione social, Meta Ads, siti web e landing page, video e reel, shooting fotografici, branding e automazioni AI: tutti i servizi di InLab Communication.',
      { sitemap: { priority: 0.9, changefreq: 'monthly' } }, [['Servizi', '/servizi']]);
  }
  if (path === '/chi-siamo') {
    return page(path, `Chi siamo | ${BRAND}, agenzia creativa in Puglia`,
      'InLab Communication è un laboratorio creativo con sede a Castellaneta (TA): strategia, contenuti e tecnologia per far crescere brand e aziende.',
      { sitemap: { priority: 0.7, changefreq: 'monthly' }, jsonLd: [
        { '@context': 'https://schema.org', '@type': 'Person', name: 'Nicola Carpignano',
          jobTitle: 'Social media manager, comunicazione e marketing', worksFor: orgRef,
          alumniOf: { '@type': 'CollegeOrUniversity', name: 'Sapienza Università di Roma' },
          knowsAbout: ['Psicologia della comunicazione', 'Digital marketing', 'Social media marketing', 'Analisi dati'] },
        { '@context': 'https://schema.org', '@type': 'Person', name: 'Ilaria Gemma',
          jobTitle: 'Content creator e comunicazione visiva', worksFor: orgRef,
          knowsAbout: ['Comunicazione', 'Video editing', 'Fotografia', 'Content creation'] },
      ] }, [['Chi siamo', '/chi-siamo']]);
  }
  if (path === '/casi-studio') {
    return page(path, `Casi studio e clienti | ${BRAND}`,
      'Progetti raccontati passo per passo: strategie social, siti web, lead generation e contenuti per aziende e attività in Puglia.',
      { sitemap: { priority: 0.8, changefreq: 'monthly' } }, [['Casi studio', '/casi-studio']]);
  }
  if (path === '/contatti') {
    return page(path, `Contatti | Richiedi un preventivo a ${BRAND}`,
      'Raccontaci il tuo progetto: social media, video, siti web o campagne. Ti rispondiamo entro 24 ore. InLab Communication, Castellaneta (TA).',
      { sitemap: { priority: 0.8, changefreq: 'monthly' }, jsonLd: [{ '@context': 'https://schema.org', '@type': 'ContactPage', url: abs(path), about: orgRef }] },
      [['Contatti', '/contatti']]);
  }

  const svc = SERVICES_SEO.find((s) => '/' + s.slug === path);
  if (svc) {
    return page(path, `${svc.label} per aziende in Puglia | ${BRAND}`, svc.description, {
      sitemap: { priority: 0.9, changefreq: 'monthly' },
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'Service', name: svc.label, serviceType: svc.keyword,
        description: svc.description, url: abs(path), provider: orgRef,
        areaServed: [{ '@type': 'AdministrativeArea', name: 'Puglia' }, { '@type': 'Country', name: 'Italia' }],
      }],
    }, [['Servizi', '/servizi'], [svc.label, path]]);
  }

  for (const s of SERVICES_SEO) {
    const city = CITIES.find((c) => path === `/${s.slug}-${c.toLowerCase()}`);
    if (city) {
      const desc = `${s.label} a ${city}: ${s.keyword} su misura per aziende e attività locali, con risultati misurabili. Preventivo gratuito.`;
      return page(path, `${s.label} a ${city} | ${BRAND}`, desc, {
        sitemap: { priority: 0.6, changefreq: 'monthly' },
        jsonLd: [{
          '@context': 'https://schema.org', '@type': 'Service', name: `${s.label} a ${city}`, serviceType: s.keyword,
          url: abs(path), provider: orgRef, areaServed: { '@type': 'City', name: city },
        }],
      }, [['Servizi', '/servizi'], [s.label, '/' + s.slug], [city, path]]);
    }
  }

  if (path.startsWith('/casi-studio/')) {
    const cs = CASES.find((c) => path === '/casi-studio/' + c.id);
    if (cs) {
      return page(path, `${cs.title} | InLab`, cs.description, {
        sitemap: { priority: 0.7, changefreq: 'monthly' },
        jsonLd: [{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: cs.title, description: cs.description, url: abs(path), creator: orgRef, inLanguage: 'it-IT' }],
      }, [['Casi studio', '/casi-studio'], [cs.title.split(':')[0], path]]);
    }
  }

  if (path.startsWith('/cliente/')) {
    const cl = clients().find((c) => path === '/cliente/' + c.id);
    if (cl) {
      const where = cl.location ? ` a ${cl.location.replace(/\s*\(TA\)/, '')}` : '';
      return page(path, `${cl.name}${where} | Clienti InLab`,
        cl.summary || cl.description || `${cl.name}: il lavoro di InLab Communication.`,
        { sitemap: { priority: 0.5, changefreq: 'monthly' } },
        [['Casi studio', '/casi-studio'], [cl.name, path]]);
    }
  }

  // Pagine non più collegate (portfolio dimostrativo) o sconosciute: non indicizzare
  return page(path, BRAND, 'Agenzia di comunicazione in Puglia.', { noindex: true, canonical: abs('/') });
};
