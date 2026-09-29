# Regole di lavoro per le sessioni Claude

Più sessioni lavorano su questo repository. Ognuna ha un'area precisa: **fuori dalla propria area non si modifica niente**, nemmeno per piccole correzioni.

## Chi fa cosa

| Sessione | Può modificare | Non può modificare |
|---|---|---|
| **Sito Inlab** (sviluppo) | tutto il codice: `src/`, `api/`, `scripts/`, `public/`, `vercel.json`, `package.json`, `firestore.rules`, `index.html`, documentazione tecnica | — |
| **Addetto SEO** | solo `docs/seo/` (brief, linee guida, prompt) | tutto il resto, compreso `src/seo/routes.ts` |
| **Addetto al Blog** | solo gli articoli: `src/data/blogSeed.ts`, `public/blog/`, `docs/blog-brief.md`, `docs/blog-reports/` | tutto il resto |
| **Analista sicurezza / controlli** | niente: legge e produce report | tutto |

Se serve una modifica al codice (titoli e descrizioni per Google, sitemap, pagine, componenti, sicurezza…), **non farla**: scrivila come richiesta nel proprio brief o report, in una sezione **"Richieste per lo sviluppo"**, con file, motivo e testo proposto. La applica la sessione Sito Inlab.

## Pubblicazione

- `main` va online in automatico su Vercel: **nessuna sessione fa push su `main`** e nessuna unisce branch in `main` da sola.
- Ogni sessione lavora sul proprio branch `claude/…` e, quando ha finito, fa push **solo sul proprio branch**.
- L'unione in `main` passa da una pull request, che viene controllata (anche per verificare che tocchi solo l'area consentita) e unita solo dopo che l'anteprima Vercel è verde.
- Mai inserire chiavi, password o dati personali dei clienti nel repository.
