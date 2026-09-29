# Regole di lavoro per le sessioni Claude

Più sessioni lavorano su questo repository. Ognuna ha un'area precisa: **fuori dalla propria area non si modifica niente**, nemmeno per piccole correzioni.

## Chi fa cosa

| Sessione | Può modificare | Non può modificare |
|---|---|---|
| **Sito Inlab** (sviluppo, responsabile tecnico) | **l'unica sessione che modifica il codice**: `src/`, `api/`, `scripts/`, `public/`, `vercel.json`, `package.json`, `firestore.rules`, `index.html`, documentazione tecnica | — |
| **Addetto SEO** | solo `docs/seo/` (analisi, brief, linee guida, prompt) | tutto il resto, compreso `src/seo/routes.ts` |
| **Addetto al Blog** | solo gli articoli: `src/data/blogSeed.ts`, `public/blog/`, `docs/blog-brief.md`, `docs/blog-reports/` | tutto il resto |
| **Analista sicurezza / controlli** | niente: **solo lettura**. Controlla che non ci siano problemi (sicurezza, errori, sito non raggiungibile…) e **avvisa il titolare** con un report in chat; le correzioni le fa la sessione Sito Inlab | tutto, compresi i file di documentazione |

Se serve una modifica al codice (titoli e descrizioni per Google, sitemap, pagine, componenti, sicurezza…), **non farla**: scrivila come richiesta nel proprio brief o report, in una sezione **"Richieste per lo sviluppo"**, con file, motivo e testo proposto. La applica la sessione Sito Inlab.

## Flusso SEO

1. L'**addetto SEO** analizza i dati di **Google Analytics e Search Console** e, in base a quelli, scrive nel brief (`docs/seo/brief/AAAA-MM-GG.md`) le modifiche da fare, nella sezione "Richieste per lo sviluppo".
2. La sessione **Sito Inlab** le applica. **Non valuta se le scelte SEO sono giuste** (è compito dell'addetto SEO, che ne è l'esperto): fa solo il **controllo tecnico**, cioè verifica che la modifica non possa bloccare, rompere o danneggiare il sito (build, pagine, redirect, sitemap, robots, canonical, dati strutturati, prestazioni, sicurezza).
3. Se una richiesta è tecnicamente rischiosa, la sessione Sito Inlab non la applica così com'è: spiega il problema e propone un'alternativa sicura con lo stesso obiettivo SEO.
4. La responsabilità tecnica del sito è della sessione Sito Inlab.

## Pubblicazione

- `main` va online in automatico su Vercel: **nessuna sessione fa push su `main`** e nessuna unisce branch in `main` da sola.
- Ogni sessione lavora sul proprio branch `claude/…` e, quando ha finito, fa push **solo sul proprio branch**.
- L'unione in `main` passa da una pull request, che viene controllata (anche per verificare che tocchi solo l'area consentita) e unita solo dopo che l'anteprima Vercel è verde.
- Mai inserire chiavi, password o dati personali dei clienti nel repository.
