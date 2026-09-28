// Articoli iniziali del blog (inclusi nel codice, quindi sempre presenti in
// sitemap e HTML pre-generato). Gli articoli scritti dalla dashboard stanno in
// Firestore (blog_posts) e, a parità di slug, sostituiscono questi.
// Nessun import di React: il file è usato anche dallo script di build.

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;      // Markdown semplice: ## titoli, **grassetto**, *corsivo*, [link](url), elenchi, > citazioni
  category: string;
  tags: string[];
  author: string;
  date: string;         // YYYY-MM-DD
  updated?: string;     // YYYY-MM-DD, ultimo aggiornamento sostanziale (dateModified per Google)
  cover?: string;
  coverAlt?: string;    // descrizione della copertina (se manca si usa il titolo)
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

// ── Funzioni pure (usate da sito, dashboard e script di build) ──
export const slugify = (s: string) => s
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

/** Pulisce un documento Firestore: solo i campi attesi, con i tipi giusti. */
export const normalizePost = (slug: string, d: any): BlogPost => ({
  slug,
  title: String(d?.title || ''),
  excerpt: String(d?.excerpt || ''),
  content: String(d?.content || ''),
  category: String(d?.category || 'Strategia'),
  tags: Array.isArray(d?.tags) ? d.tags.map(String).slice(0, 12) : [],
  author: String(d?.author || 'InLab Communication'),
  date: /^\d{4}-\d{2}-\d{2}$/.test(d?.date) ? d.date : new Date().toISOString().slice(0, 10),
  updated: /^\d{4}-\d{2}-\d{2}$/.test(d?.updated) ? d.updated : undefined,
  cover: d?.cover ? String(d.cover) : undefined,
  coverAlt: d?.coverAlt ? String(d.coverAlt) : undefined,
  published: d?.published === true,
  seoTitle: d?.seoTitle ? String(d.seoTitle) : undefined,
  seoDescription: d?.seoDescription ? String(d.seoDescription) : undefined,
});

export const mergePosts = (seed: BlogPost[], remote: BlogPost[]) => {
  const map = new Map<string, BlogPost>();
  seed.forEach((p) => map.set(p.slug, p));
  remote.forEach((p) => map.set(p.slug, p));
  return [...map.values()]
    .filter((p) => p.published && p.title)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
};

export const BLOG_CATEGORIES = ['Social media', 'Video & Reel', 'Siti web', 'Strategia', 'Advertising'];

export const BLOG_SEED: BlogPost[] = [
  {
    slug: 'gestione-social-attivita-locale-cosa-include',
    title: 'Gestione social per attività locali: cosa include davvero (e come sceglierla)',
    excerpt: 'Piano editoriale, contenuti, community, report: cosa aspettarsi da una gestione social professionale e le domande da fare prima di scegliere un\'agenzia.',
    category: 'Social media',
    tags: ['gestione social', 'attività locali', 'Instagram', 'Facebook'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    published: true,
    seoTitle: 'Gestione social per attività locali: cosa include | InLab',
    seoDescription: 'Cosa include una gestione social professionale per attività locali e come scegliere l\'agenzia giusta: piano editoriale, contenuti, community e report.',
    content: `Molte attività aprono una pagina Instagram, pubblicano per qualche settimana e poi si fermano. Non per pigrizia: gestire i social bene richiede tempo, idee e costanza. Per questo sempre più aziende affidano la comunicazione a un'agenzia. Ma cosa significa, in concreto, "gestione social"?

## 1. Strategia prima dei contenuti

Una gestione seria non parte dai post, ma dalle domande: **a chi ti rivolgi, cosa ti distingue, cosa vuoi ottenere?** Più prenotazioni, più persone in negozio, più richieste di preventivo. Da qui nascono il tono di voce, lo stile visivo e i canali giusti: non tutte le attività devono essere su TikTok, e non tutte hanno bisogno di LinkedIn.

## 2. Il piano editoriale

È il calendario dei contenuti: cosa pubblicare, quando e con quale obiettivo. Un buon piano alterna contenuti diversi:

- **Contenuti che fanno conoscere** l'attività e le persone che ci lavorano
- **Contenuti utili** che rispondono alle domande dei clienti
- **Prove concrete**: recensioni, lavori realizzati, prima e dopo
- **Contenuti che portano all'azione**: offerte, eventi, inviti a contattarti

## 3. Produzione di foto, video e testi

Qui si vede la differenza. Foto curate, reel girati bene e testi scritti per il tuo pubblico rendono l'attività riconoscibile. I video brevi, in particolare, oggi sono il formato che raggiunge più persone nuove.

## 4. Community e messaggi

Rispondere ai commenti e ai messaggi fa parte del lavoro: è lì che un utente curioso diventa un cliente. Tempi di risposta rapidi e un tono coerente contano quanto un bel post.

## 5. Numeri e miglioramento

Ogni mese si guardano i dati: quali contenuti funzionano, da dove arrivano i contatti, cosa cambiare. **La strategia evolve con i risultati reali**, non con le impressioni.

## Le domande da fare prima di scegliere

> Puoi vedere lavori reali per attività simili alla mia? Chi produce foto e video? Ogni quanto ricevo un report e cosa contiene?

Un'agenzia seria risponde con esempi concreti e non promette risultati garantiti in poche settimane.

Vuoi capire come potrebbe funzionare per la tua attività? [Scopri il servizio di gestione social](/gestione-social) oppure [scrivici](/contatti): la prima chiacchierata è senza impegno.`,
  },
  {
    slug: 'reel-o-post-cosa-pubblicare-instagram',
    title: 'Reel o post? Cosa pubblicare su Instagram per far crescere un\'attività locale',
    excerpt: 'Reel per farsi scoprire, caroselli per spiegare, storie per restare in contatto: come usare ogni formato e costruire un mix che porta clienti.',
    category: 'Video & Reel',
    tags: ['reel', 'Instagram', 'contenuti', 'video'],
    author: 'Ilaria Gemma',
    date: '2026-09-28',
    published: true,
    seoTitle: 'Reel o post su Instagram? Guida per attività locali | InLab',
    seoDescription: 'Reel, caroselli o storie: come usare ogni formato di Instagram per far crescere un\'attività locale e costruire un piano di contenuti che porta clienti.',
    content: `"Meglio fare reel o post?" è una delle domande che ci fanno più spesso. La risposta breve: **servono entrambi, ma con obiettivi diversi.** Vediamo come usarli.

## Reel: per farti scoprire

I reel sono il formato che Instagram mostra di più a chi non ti segue ancora. Sono perfetti per:

- far conoscere l'attività a persone nuove della tua zona
- mostrare le persone, il dietro le quinte, il "come lo facciamo"
- raccontare con leggerezza e personalità

Non servono produzioni da film: servono **un'idea chiara nei primi secondi**, un buon ritmo e una storia semplice. Spesso i reel più efficaci sono quelli più autentici.

## Caroselli: per spiegare e convincere

Il carosello (più immagini da scorrere) funziona quando devi spiegare: un servizio, un prima e dopo, i passaggi di un trattamento, le domande frequenti. Viene salvato e condiviso, e aiuta chi ti conosce già a decidere.

## Storie: per restare in contatto

Le storie non portano molti nuovi follower, ma tengono vivo il rapporto con chi ti segue: novità del giorno, sondaggi, risposte alle domande, promemoria di eventi. Sono il formato più "vicino" alle persone.

## Un mix che funziona

Per molte attività locali un buon punto di partenza è:

- **2-3 reel a settimana** per farsi scoprire
- **1 carosello** per spiegare o mostrare risultati
- **storie quasi ogni giorno** per restare presenti

Poi i numeri dicono cosa aumentare e cosa ridurre.

## L'errore più comune

Pubblicare tanto senza un filo conduttore. Meglio pochi contenuti riconoscibili e costanti che tanti post scollegati.

Se vuoi reel che raccontano davvero la tua attività, dai un'occhiata al nostro [servizio Video & Reels](/video) o [raccontaci il tuo progetto](/contatti).`,
  },
  {
    slug: 'sito-web-o-solo-social-attivita-locale',
    title: 'Sito web o solo social? Perché a un\'attività locale servono entrambi',
    excerpt: 'I social ti fanno scoprire, il sito ti fa scegliere. Come lavorano insieme sito, pagine dei servizi e social per trasformare l\'interesse in contatti.',
    category: 'Siti web',
    tags: ['sito web', 'SEO locale', 'lead generation'],
    author: 'Nicola Carpignano',
    date: '2026-09-28',
    published: true,
    seoTitle: 'Sito web o solo social? Cosa serve a un\'attività locale | InLab',
    seoDescription: 'Perché un\'attività locale ha bisogno sia dei social sia di un sito web: come lavorano insieme per farti trovare su Google e trasformare l\'interesse in contatti.',
    content: `"Ho Instagram, a cosa mi serve un sito?" È una domanda legittima. I social sono fondamentali, ma da soli lasciano scoperte alcune cose importanti.

## I social ti fanno scoprire

Sui social le persone ti incontrano mentre scorrono il feed: vedono un reel, una foto, una storia. È il momento dell'**attenzione**. Ma quando qualcuno sta per scegliere, di solito cerca di più.

## Il sito ti fa scegliere

Quando una persona cerca su Google "dentista a Palagiano" o "ristorante a Castellaneta", trova siti e schede Google, non post Instagram. Il sito serve a:

- **farti trovare su Google** con le pagine dei tuoi servizi
- **spiegare con calma** cosa fai, come lavori, quanto tempo serve
- **rassicurare** con recensioni, casi reali, foto dello studio o del locale
- **raccogliere contatti** con moduli, telefono, WhatsApp, prenotazioni

## Come lavorano insieme

Il percorso ideale è semplice: i social portano attenzione, il sito approfondisce e trasforma l'interesse in una richiesta. Per lo Studio Dentistico Ricciardi, ad esempio, abbiamo costruito il nuovo sito **Lumina** con pagine dedicate ai trattamenti, collegato a contenuti social e campagne: [leggi il caso studio](/casi-studio/ricciardi).

## Il sito è tuo

C'è anche un motivo pratico: i social possono cambiare regole, ridurre la visibilità o bloccare un profilo. **Il sito e il dominio restano tuoi**, e tutto quello che costruisci lì non si perde.

## Cosa deve avere un buon sito per un'attività locale

- caricamento veloce e ottima resa da telefono
- una pagina per ogni servizio principale
- contatti sempre visibili
- testi scritti per le persone (e per Google)

Vuoi capire di cosa ha bisogno la tua attività? Scopri il servizio [Siti Web & Web App](/siti-web) o [scrivici](/contatti).`,
  },
];
