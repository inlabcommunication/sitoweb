# Articoli del blog

Ogni articolo è un file Markdown `content/blog/<slug>.md` con frontmatter YAML.
Le immagini sono in `public/blog/<slug>/` (servite su `/blog/<slug>/...`).
`content/blog/index.json` è l'elenco degli articoli (solo metadati, ordinati dal più recente),
rigenerato con `python3 tools/blog-index.py`.

URL previsto degli articoli: `/blog/<slug>`.

## Campi del frontmatter

| Campo | Uso |
|---|---|
| `title` | titolo SEO / titolo della card |
| `slug` | parte finale dell'URL |
| `h1` | titolo principale della pagina (il corpo non contiene H1) |
| `metaTitle` | `<title>` (max 60 caratteri) |
| `metaDescription` | meta description (max ~155 caratteri) |
| `excerpt` | anteprima nella lista articoli |
| `date`, `updated` | data di pubblicazione e ultimo aggiornamento (AAAA-MM-GG) |
| `author`, `category`, `tags`, `readingTime` | metadati di visualizzazione |
| `keyword`, `secondaryKeywords`, `searchIntent` | note SEO (non mostrate) |
| `heroImage` | `src` (webp 1200×630), `og` (png per anteprime social), `alt`, `title`, `prompt`, `position` |
| `images` | infografiche nel corpo, con `alt`, `title`, `prompt`, `position` |
| `faq` | domande/risposte, anche per lo schema `FAQPage` |
| `sources` | fonti citate |
| `internalLinks`, `related`, `relatedIdeas` | link interni usati, articoli correlati, idee future |
| `schema` | dati strutturati consigliati (`Article`, `FAQPage`, `BreadcrumbList`) |

## Immagini

Generate da codice con lo stile del sito: spec in `tools/blog-images/specs/<slug>.cjs`, poi

```bash
NODE_PATH=$(npm root -g) node tools/blog-images/gen.cjs tools/blog-images/specs/<slug>.cjs
```

Il campo `prompt` di ogni immagine permette di rigenerarla con un generatore AI, se si preferisce.

## Processo editoriale

Brief completo (fonti, criteri A/B/C, formato, stile, regole di qualità): [`docs/blog-brief.md`](../../docs/blog-brief.md).
I report di ogni sessione di monitoraggio sono in `docs/blog-reports/`.
