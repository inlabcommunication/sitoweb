// Registro SEO: titolo, descrizione, canonical e dati strutturati per ogni
// pagina. Usato sia dal browser (aggiorna <head> a ogni cambio pagina) sia
// dallo script di build che genera l'HTML statico, la sitemap e robots.txt.
// Nessun import di React qui: deve poter girare anche in Node.

import { WEBSITE_CONTENT } from '../constants';
import { getClientId } from '../lib/clientUtils';
// Solo il tipo: il testo degli articoli (molto pesante) si carica solo quando
// si apre il blog (src/lib/blog.ts lo registra qui) o nello script di build.
import type { BlogPost } from '../data/blogSeed';

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
  // Indirizzo confermato da Nicola il 02/10 (senza civico finché non lo conferma)
  street: 'Via Regina Margherita',
  postalCode: '74011',
  city: 'Castellaneta',
  region: 'Puglia',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Via+Regina+Margherita+74011+Castellaneta+TA',
  sameAs: [
    'https://www.instagram.com/inlab.communication/',
    'https://www.facebook.com/inlab.communication',
    'https://www.linkedin.com/company/inlab-communication/',
  ],
};

// Città con clienti reali (indicazione del titolare, 29/09/2026): hanno anche
// le pagine per servizio /{servizio}-{città}. Ginosa resta: Paresteta ha un
// negozio lì.
export const CITIES = ['Taranto', 'Palagiano', 'Palagianello', 'Mottola', 'Castellaneta', 'Laterza', 'Ginosa', 'Gravina in Puglia'];
// Città senza clienti per ora (brief SEO 02/10, punto 5, confermato da Nicola):
// solo la pagina /agenzia-comunicazione-{città}, nessuna pagina per servizio.
// Le vecchie /{servizio}-massafra restano in redirect 301 (vercel.json): la
// regola elenca solo gli slug dei servizi, quindi non tocca l'agenzia.
export const EXTRA_AGENCY_CITIES = ['Massafra', 'Bari', 'Matera', 'Gioia del Colle'];
/** Parte dell'indirizzo della città: "Gravina in Puglia" → "gravina-in-puglia". */
export const citySlug = (c: string) => c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
/** Pagine "Agenzia di comunicazione e marketing a {città}": tutte le città,
 *  Castellaneta compresa (dal 02/10, la home resta la pagina del brand). */
export const AGENCY_CITIES = [...CITIES, ...EXTRA_AGENCY_CITIES];
export const agencyPath = (c: string) => `/agenzia-comunicazione-${citySlug(c)}`;

export const SERVICES_SEO = [
  { slug: 'gestione-social', label: 'Gestione Social', keyword: 'gestione social media',
    description: 'Gestione social media professionale per aziende: strategia, piano editoriale, contenuti, reel e community su Instagram, Facebook, TikTok e LinkedIn.' },
  { slug: 'meta-ads', label: 'Meta Ads', keyword: 'campagne Meta Ads',
    description: 'Campagne Meta Ads su Facebook e Instagram per aziende e attività locali in Puglia: targeting, creatività, test A/B e report chiari per generare contatti.' },
  { slug: 'siti-web', label: 'Siti Web & Web App', keyword: 'realizzazione siti web',
    description: 'Realizzazione siti web, e-commerce e landing page veloci, ottimizzati SEO e pensati per portare clienti: design su misura, sviluppo e gestione.' },
  { slug: 'automazioni-ai', label: 'Automazioni AI', keyword: 'automazioni e chatbot AI',
    description: 'Chatbot, automazioni e workflow con intelligenza artificiale per aziende in Puglia: risparmi tempo, gestisci i contatti e rispondi ai clienti a ogni ora.' },
  { slug: 'shooting', label: 'Foto & Shooting', keyword: 'shooting fotografico',
    description: 'Shooting fotografici professionali per brand, prodotti, food ed eventi in provincia di Taranto: immagini curate per social, sito web e campagne.' },
  { slug: 'video', label: 'Video & Reels', keyword: 'video e reel per social',
    description: 'Produzione video e reel per social: idea, riprese, montaggio e caption. Contenuti che le persone guardano davvero, fino a milioni di views organiche.' },
  { slug: 'branding', label: 'Branding & Identità', keyword: 'branding e identità visiva',
    description: 'Branding e identità visiva per aziende e attività in Puglia: nome, logo, palette e tono di voce per un brand riconoscibile e coerente su ogni canale.' },
];

// Clienti e casi studio: predefiniti dal codice, sostituiti da quelli salvati in
// dashboard quando disponibili (browser dopo il caricamento, build via REST).
let siteClients: any[] = ((WEBSITE_CONTENT as any).clients?.items || []) as any[];
let siteCases: any[] = ((WEBSITE_CONTENT as any).cases?.items || []) as any[];
export const registerContent = (content: any) => {
  if (Array.isArray(content?.clients?.items)) siteClients = content.clients.items;
  if (Array.isArray(content?.cases?.items)) siteCases = content.cases.items;
};
const caseSeo = (c: any) => ({
  id: String(c.id),
  title: c.seoTitle || `${c.client}: ${c.title}`,
  description: c.seoDescription || c.problem || c.hero?.intro || c.title || '',
});

export type Seo = {
  path: string;
  title: string;
  description: string;
  canonical: string;
  image: string;
  noindex?: boolean;
  jsonLd: object[];
  /** ultima modifica reale (AAAA-MM-GG) per la sitemap; assente = non indicata */
  lastmod?: string;
  /** priorità/frequenza per la sitemap (assente = non in sitemap) */
  sitemap?: { priority: number; changefreq: 'weekly' | 'monthly' };
};

const abs = (path: string) => SITE_URL + (path === '/' ? '/' : path);
/** Aggiunge il marchio al titolo restando entro i 60 caratteri che Google mostra. */
const withBrand = (t: string) => [`${t} | ${BRAND}`, `${t} | InLab`, t].find((x) => x.length <= 60) || t;
const clip = (s: string, n = 160) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

const orgRef = { '@id': `${SITE_URL}/#organization` };
/** Immagine nei dati strutturati con autore e copyright (brief SEO 2026-09-30, richiesta 7). */
const imageObject = (url: string, caption?: string, size?: { width: number; height: number }) => ({
  '@type': 'ImageObject', url, contentUrl: url,
  ...(size ? { width: size.width, height: size.height } : {}),
  ...(caption ? { caption } : {}),
  creator: orgRef, creditText: 'InLab Communication', copyrightNotice: '© InLab Communication',
});

// Fondatori/autori: una sola identità (Person con @id) usata in /chi-siamo,
// nelle pagine autore, in Organization.founder e negli articoli.
export const AUTHORS = [
  { slug: 'nicola-carpignano', name: 'Nicola Carpignano', jobTitle: 'Social media manager, comunicazione e marketing',
    title: 'Nicola Carpignano: social media e marketing a Castellaneta',
    description: 'Nicola Carpignano, social media manager e co-fondatore di InLab Communication a Castellaneta (TA): strategia, contenuti e marketing per attività locali.',
    alumniOf: 'Sapienza Università di Roma',
    knowsAbout: ['Psicologia della comunicazione', 'Digital marketing', 'Social media marketing', 'Analisi dati',
      'Social media management', 'Marketing degli eventi', 'Netnografia'],
    // Dati confermati da Nicola (brief SEO 02/10, punto 4)
    homeLocation: 'Palagianello',
    facts: ['Originario di Palagianello (TA).', 'Ha studiato Psicologia a Bari.',
      'Docente di Marketing e Social Media in due master di EA Formazione (Bari): il Master in Management degli Eventi e il master sui social media.'],
    inBreve: 'Originario di Palagianello (TA), ha studiato Psicologia a Bari e insegna Marketing e Social Media nei master di EA Formazione.',
    teaching: { name: 'Docente di Marketing e Social Media', description: 'Master in Management degli Eventi e master sui social media di EA Formazione (Bari)', location: 'Bari' },
    research: [{
      authors: ['De Rosa A. M. S.', 'Bocci E.', 'Carpignano N.'], year: '2020',
      title: 'Polemical social representations about "immigration" in journal articles of different political positioning via Facebook',
      book: 'Political and economic self-constitution: media, political culture and democracy',
      publisher: 'Institute of Social Sciences (Belgrado)', pages: '58-64',
      url: 'https://iris.uniroma1.it/handle/11573/1544870',
    }],
    sameAs: [] as string[] },
  { slug: 'ilaria-gemma', name: 'Ilaria Gemma', jobTitle: 'Content creator e comunicazione visiva',
    title: 'Ilaria Gemma: content creator, foto e video a Castellaneta',
    description: 'Ilaria Gemma, content creator e co-fondatrice di InLab Communication a Castellaneta (TA): foto, video, reel e comunicazione visiva per i brand locali.',
    alumniOf: '',
    knowsAbout: ['Comunicazione', 'Video editing', 'Fotografia', 'Content creation'],
    sameAs: [] as string[] },
] as AuthorData[];
type Research = { authors: string[]; year: string; title: string; book: string; publisher: string; pages: string; url: string };
type AuthorData = {
  slug: string; name: string; jobTitle: string; title: string; description: string; alumniOf: string;
  knowsAbout: string[]; sameAs: string[];
  homeLocation?: string; facts?: string[]; inBreve?: string;
  teaching?: { name: string; description: string; location: string }; research?: Research[];
};
export type Author = AuthorData;
export const authorPath = (slug: string) => `/autori/${slug}`;
/** Autore da nome visualizzato (es. firma di un articolo); undefined se non è un fondatore. */
export const authorByName = (name?: string) => AUTHORS.find((a) => a.name.toLowerCase() === String(name || '').trim().toLowerCase());
const personId = (a: Author) => `${SITE_URL}${authorPath(a.slug)}#person`;
const personRef = (a: Author) => ({ '@type': 'Person', '@id': personId(a), name: a.name, url: SITE_URL + authorPath(a.slug) });
const personJsonLd = (a: Author) => ({
  '@context': 'https://schema.org', '@type': 'Person', '@id': personId(a), name: a.name,
  url: SITE_URL + authorPath(a.slug), jobTitle: a.jobTitle, worksFor: orgRef,
  workLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Castellaneta', addressRegion: 'TA', addressCountry: 'IT' } },
  ...(a.alumniOf ? { alumniOf: { '@type': 'CollegeOrUniversity', name: a.alumniOf } } : {}),
  knowsAbout: a.knowsAbout, sameAs: a.sameAs,
  ...(a.homeLocation ? { homeLocation: { '@type': 'Place', name: a.homeLocation,
    address: { '@type': 'PostalAddress', addressLocality: a.homeLocation, addressRegion: 'TA', addressCountry: 'IT' } } } : {}),
  ...(a.teaching ? { hasOccupation: { '@type': 'Occupation', name: a.teaching.name, description: a.teaching.description,
    occupationLocation: { '@type': 'City', name: a.teaching.location } } } : {}),
});
/** Pubblicazioni dell'autore, collegate alla sua Person con @id. */
const researchJsonLd = (a: Author) => (a.research || []).map((r) => ({
  '@context': 'https://schema.org', '@type': 'ScholarlyArticle', headline: r.title, url: r.url, datePublished: r.year,
  author: r.authors.map((n) => n.startsWith(a.name.split(' ').pop()!) ? { '@id': personId(a) } : { '@type': 'Person', name: n }),
  isPartOf: { '@type': 'Book', name: r.book, publisher: { '@type': 'Organization', name: r.publisher } },
  pagination: r.pages, inLanguage: 'en',
}));

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': ['ProfessionalService', 'LocalBusiness'],
  '@id': `${SITE_URL}/#organization`,
  name: BRAND,
  description: 'Agenzia di comunicazione con sede a Castellaneta (Taranto): gestione social, video e reel, Meta Ads, siti web, branding e automazioni AI per aziende in Puglia e non solo.',
  // Distingue l'agenzia da realtà con nomi simili (Google e i sistemi AI le confondevano)
  alternateName: ['InLab Communication Castellaneta', 'InLab Castellaneta'],
  disambiguatingDescription: 'InLab Communication è l\'agenzia di comunicazione e marketing di Castellaneta, in provincia di Taranto (Puglia), fondata da Nicola Carpignano e Ilaria Gemma. Non è collegata ad altre realtà con nomi simili, come inlab di inDrive, InLab Comunicazione di Forlì o laboratori universitari chiamati InLab.',
  founder: AUTHORS.map(personRef),
  knowsLanguage: 'it',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  vatID: 'IT03411970738',
  image: abs(DEFAULT_OG_IMAGE),
  email: BUSINESS.email,
  telephone: BUSINESS.telephone,
  contactPoint: { '@type': 'ContactPoint', telephone: BUSINESS.telephone, email: BUSINESS.email, contactType: 'customer service', areaServed: 'IT', availableLanguage: 'Italian' },
  address: { '@type': 'PostalAddress', streetAddress: BUSINESS.street, addressLocality: BUSINESS.city, postalCode: BUSINESS.postalCode, addressRegion: 'TA', addressCountry: 'IT' },
  // città con clienti reali e città seguite (AGENCY_CITIES), più Puglia e Italia
  areaServed: [...AGENCY_CITIES.map((name) => ({ '@type': 'City', name })), { '@type': 'AdministrativeArea', name: 'Puglia' }, { '@type': 'Country', name: 'Italia' }],
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

// Articoli del blog: quelli nel codice + quelli pubblicati dalla dashboard
// (registrati dal browser dopo il caricamento e dallo script di build).
let blogPosts: BlogPost[] = [];
export const registerBlogPosts = (posts: BlogPost[]) => { blogPosts = posts.filter((p) => p.published); };
export const getBlogPosts = () => blogPosts;
const plain = (md: string) => md.replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#>*_`]/g, '').replace(/\s+/g, ' ').trim();

const clients = () => siteClients.filter((c) => c && c.name).map((c, i) => ({ ...c, id: getClientId(c, i) }));
const cases = () => siteCases.filter((c) => c && c.id && c.client).map(caseSeo);

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
  ...SERVICES_SEO.flatMap((s) => CITIES.map((c) => `/${s.slug}-${citySlug(c)}`)),
  ...AGENCY_CITIES.map(agencyPath),
  ...cases().map((c) => '/casi-studio/' + c.id),
  ...clients().map((c) => '/cliente/' + c.id),
  '/blog', '/privacy',
  ...AUTHORS.map((a) => authorPath(a.slug)),
  ...blogPosts.map((p) => '/blog/' + p.slug),
];

export const getSeo = (rawPath: string): Seo => {
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : '/';

  if (path === '/') {
    return page('/', `${BRAND} Castellaneta | Agenzia di comunicazione`,
      'Agenzia di comunicazione a Castellaneta (TA): social media, reel e video, siti web, branding e Meta Ads per aziende in provincia di Taranto e in Puglia.',
      { sitemap: { priority: 1, changefreq: 'weekly' } }); // i dati dell'agenzia sono già nello script "org" di index.html
  }
  if (path === '/servizi') {
    return page(path, `Servizi di comunicazione digitale | ${BRAND}`,
      'Gestione social, Meta Ads, siti web e landing page, video e reel, shooting fotografici, branding e automazioni AI: tutti i servizi di InLab Communication.',
      { sitemap: { priority: 0.9, changefreq: 'monthly' } }, [['Servizi', '/servizi']]);
  }
  if (path === '/chi-siamo') {
    return page(path, 'Chi siamo: Nicola Carpignano e Ilaria Gemma | InLab',
      'Nicola Carpignano e Ilaria Gemma, i fondatori di InLab Communication: comunicazione, social media, foto e video per le attività di Castellaneta (TA).',
      { sitemap: { priority: 0.7, changefreq: 'monthly' }, jsonLd: AUTHORS.map(personJsonLd) }, [['Chi siamo', '/chi-siamo']]);
  }
  const author = AUTHORS.find((a) => path === authorPath(a.slug));
  if (author) {
    return page(path, withBrand(author.title), author.description, {
      sitemap: { priority: 0.6, changefreq: 'monthly' },
      jsonLd: [{ '@context': 'https://schema.org', '@type': 'ProfilePage', url: abs(path), inLanguage: 'it-IT', mainEntity: personJsonLd(author) },
        ...researchJsonLd(author)],
    }, [['Chi siamo', '/chi-siamo'], [author.name, path]]);
  }
  if (path === '/casi-studio') {
    return page(path, `Casi studio e clienti | ${BRAND}`,
      'Progetti raccontati passo per passo: strategie social, siti web, lead generation e contenuti per aziende e attività in provincia di Taranto e in Puglia.',
      { sitemap: { priority: 0.8, changefreq: 'monthly' } }, [['Casi studio', '/casi-studio']]);
  }
  if (path === '/contatti') {
    return page(path, `Contatti | Richiedi un preventivo a ${BRAND}`,
      'Raccontaci il tuo progetto: social media, video, siti web o campagne. Ti rispondiamo entro 24 ore. InLab Communication, agenzia a Castellaneta (TA).',
      { sitemap: { priority: 0.8, changefreq: 'monthly' }, jsonLd: [{ '@context': 'https://schema.org', '@type': 'ContactPage', url: abs(path), about: orgRef }] },
      [['Contatti', '/contatti']]);
  }

  const svc = SERVICES_SEO.find((s) => '/' + s.slug === path);
  if (svc) {
    return page(path, withBrand(`${svc.label} per aziende in Puglia`), svc.description, {
      sitemap: { priority: 0.9, changefreq: 'monthly' },
      jsonLd: [{
        '@context': 'https://schema.org', '@type': 'Service', name: svc.label, serviceType: svc.keyword,
        description: svc.description, url: abs(path), provider: orgRef,
        areaServed: [{ '@type': 'AdministrativeArea', name: 'Puglia' }, { '@type': 'Country', name: 'Italia' }],
      }],
    }, [['Servizi', '/servizi'], [svc.label, path]]);
  }

  for (const s of SERVICES_SEO) {
    const city = CITIES.find((c) => path === `/${s.slug}-${citySlug(c)}`);
    if (city) {
      // la frase finale più lunga che resta entro i 155 caratteri mostrati da Google
      const base = `${s.label} a ${city}: ${s.keyword} per aziende e attività locali`;
      const desc = [
        ", da un'agenzia con sede a Castellaneta (TA). Preventivo gratuito.",
        ", da un'agenzia di Castellaneta (TA). Preventivo gratuito.",
      ].map((t) => base + t).find((d) => d.length <= 155) || base + '.';
      return page(path, withBrand(`${s.label} a ${city}`), desc, {
        sitemap: { priority: 0.6, changefreq: 'monthly' },
        jsonLd: [{
          '@context': 'https://schema.org', '@type': 'Service', name: `${s.label} a ${city}`, serviceType: s.keyword,
          url: abs(path), provider: orgRef, areaServed: { '@type': 'City', name: city },
        }],
      }, [['Servizi', '/servizi'], [s.label, '/' + s.slug], [city, path]]);
    }
  }

  const agencyCity = AGENCY_CITIES.find((c) => path === agencyPath(c));
  if (agencyCity) {
    const c = agencyCity;
    const title = [
      `Agenzia di comunicazione e marketing a ${c} | InLab`,
      `Agenzia comunicazione e marketing a ${c} | InLab`,
      `Agenzia di comunicazione e marketing a ${c}`,
    ].find((t) => t.length <= 60) || `Agenzia di comunicazione a ${c} | InLab`;
    const desc = c === BUSINESS.city
      ? 'Agenzia di comunicazione e marketing con sede a Castellaneta (TA): social, video, Meta Ads, siti web e branding per attività del paese e della Marina.'
      : [
      `Agenzia di comunicazione e marketing per attività di ${c}: social, video, Meta Ads, siti web e branding. Da Castellaneta (TA), preventivo gratuito.`,
      `Agenzia di comunicazione e marketing per attività di ${c}: social, video, Meta Ads, siti web e branding. Da Castellaneta, preventivo gratuito.`,
      `Agenzia di comunicazione e marketing per attività di ${c}: social, video, Meta Ads, siti web e branding. Preventivo gratuito.`,
    ].find((d) => d.length <= 155)!;
    return page(path, title, desc, {
      sitemap: { priority: 0.7, changefreq: 'monthly' },
      jsonLd: [{ '@context': 'https://schema.org', '@type': 'Service', name: `Agenzia di comunicazione e marketing a ${c}`,
        serviceType: 'agenzia di comunicazione e marketing', url: abs(path), provider: orgRef, areaServed: { '@type': 'City', name: c } }],
    }, [['Servizi', '/servizi'], [`Agenzia a ${c}`, path]]);
  }

  if (path.startsWith('/casi-studio/')) {
    const cs = cases().find((c) => path === '/casi-studio/' + c.id);
    if (cs) {
      return page(path, withBrand(cs.title), cs.description, {
        sitemap: { priority: 0.7, changefreq: 'monthly' },
        jsonLd: [{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: cs.title, description: cs.description, url: abs(path), creator: orgRef, inLanguage: 'it-IT' }],
      }, [['Casi studio', '/casi-studio'], [cs.title.split(':')[0], path]]);
    }
  }

  if (path === '/privacy') {
    return page(path, `Privacy e cookie | ${BRAND}`,
      'Informativa privacy e cookie di InLab Communication: quali dati raccoglie il sito, perché, per quanto tempo e come esercitare i tuoi diritti.',
      { sitemap: { priority: 0.2, changefreq: 'monthly' } }, [['Privacy e cookie', '/privacy']]);
  }

  if (path === '/blog') {
    return page(path, withBrand('Blog: social, reel e siti web per attività locali'),
      'Guide pratiche e consigli su social media, reel, siti web e advertising per aziende e attività locali, scritti dal team di InLab Communication.',
      { lastmod: blogPosts.reduce((m, p) => { const d = p.updated && p.updated > p.date ? p.updated : p.date; return d > m ? d : m; }, '') || undefined,
        sitemap: { priority: 0.7, changefreq: 'weekly' }, jsonLd: [{
        '@context': 'https://schema.org', '@type': 'Blog', name: `Blog ${BRAND}`, url: abs(path), inLanguage: 'it-IT', publisher: orgRef,
        blogPost: blogPosts.slice(0, 20).map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs('/blog/' + p.slug), datePublished: p.date })),
      }] }, [['Blog', '/blog']]);
  }

  if (path.startsWith('/blog/')) {
    const post = blogPosts.find((p) => path === '/blog/' + p.slug);
    if (post) {
      const desc = post.seoDescription || post.excerpt || plain(post.content);
      const image = post.cover ? (post.cover.startsWith('/') ? abs(post.cover) : post.cover) : abs(DEFAULT_OG_IMAGE);
      const words = plain(post.content).split(' ').length;
      const modified = post.updated && post.updated > post.date ? post.updated : post.date;
      return page(path, post.seoTitle || withBrand(post.title), desc, {
        image, lastmod: modified,
        sitemap: { priority: 0.6, changefreq: 'monthly' },
        jsonLd: [{
          '@context': 'https://schema.org', '@type': 'BlogPosting',
          headline: post.title.slice(0, 110), description: clip(desc),
          // le copertine del blog sono JPG 1600×900 (linee guida blog, §8)
          image: [imageObject(image, post.coverAlt || post.title, post.cover?.startsWith('/') ? { width: 1600, height: 900 } : undefined)],
          datePublished: post.date, dateModified: modified,
          author: authorByName(post.author) ? personRef(authorByName(post.author)!) : { '@type': 'Person', name: post.author },
          publisher: orgRef, mainEntityOfPage: abs(path), url: abs(path),
          articleSection: post.category, keywords: post.tags.join(', '), wordCount: words, inLanguage: 'it-IT',
        }],
      }, [['Blog', '/blog'], [post.title, path]]);
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
