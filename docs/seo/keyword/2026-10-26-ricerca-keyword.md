# Ricerca parole chiave, 26/10/2026

**Fonti usate (gratuite, dati reali):**
- **Suggerimenti di ricerca di Google** (autocompletamento), con lo strumento `docs/seo/strumenti/keyword-suggest.py`. Un suggerimento compare solo se molte persone lo cercano davvero.
- **Search Console**, cioè le query per cui il sito è già mostrato.
- **Report competitor** in `docs/competitor/`.

**Limite:** non abbiamo SEMrush, SEOZoom o il Keyword Planner di Google Ads, quindi **niente volumi esatti né difficoltà numerica**. La priorità qui sotto si basa su tre segnali: la ricerca compare nei suggerimenti, l'intento della ricerca e la concorrenza vista su Google. Se Nicola ha un account Google Ads, il Keyword Planner (gratuito con l'account) darebbe i volumi: vedi le richieste in fondo.

## 1. Cosa cerca la gente (servizio + città)

| Gruppo | Ricerche reali trovate | Intento | Nostra pagina oggi | Azione |
|---|---|---|---|---|
| **Social media manager** | social media manager Taranto, Bari, Lecce, Puglia, Matera, Martina Franca; "… e provincia" | commerciale | `/gestione-social-{città}`, con title "Gestione social a {città}" | **Mettere "Social media manager" nel title** delle pagine gestione social (vedi brief) |
| **Agenzia marketing** | agenzia marketing Taranto, Bari, Lecce, Puglia, Matera, Martina Franca; "agenzia di marketing e comunicazione Puglia" | commerciale | `/agenzia-comunicazione-{città}`, con title "Agenzia di comunicazione e marketing a…" | già coperto ✔ |
| **Agenzia di comunicazione** | Taranto, Bari, Lecce, Puglia, Matera, Martina Franca | commerciale | idem | già coperto ✔ |
| **Web agency** | web agency Taranto, Bari, Lecce, Puglia, Matera, Martina Franca; realizzazione siti web Taranto, Lecce | commerciale | `/siti-web-{città}` (solo città vecchie) | Mettere "Web agency" nel title di `/siti-web-{città}` |
| **Videomaker** | videomaker Taranto, Bari, Lecce, Puglia, Matera | commerciale | `/video-{città}`, con title "Video & Reels a…" | Mettere "Videomaker" nel title di `/video-{città}` |
| **Fotografo** | fotografo Castellaneta, Castellaneta Marina, Martina Franca, Massafra, Taranto | misto: molte ricerche sono per fototessere e matrimoni | `/shooting-{città}` | Title "Fotografo per aziende a {città}", per prendere solo l'intento giusto |
| **Consulente marketing** | consulente (web) marketing Bari, Lecce, Puglia | commerciale | nessuna | Per ora coperto dalle pagine agenzia; da valutare tra qualche mese |

**Da evitare** (intento sbagliato): "corso social media manager…", "lavoro / stage…", "fotografo fototessera", "fotografo matrimonio".

## 2. Domande per il blog (intento informativo)

| Ricerca reale | Articolo proposto | Note |
|---|---|---|
| quanto costa un social media manager (al mese, freelance, agenzia) | "Quanto costa un social media manager in Puglia: da cosa dipende il prezzo" | Regola di Nicola: **niente prezzi InLab**, solo i fattori che fanno cambiare il prezzo e, se c'è, una fonte esterna sui prezzi di mercato |
| quanto costa un sito web (semplice, vetrina, per un ristorante, e-commerce, all'anno) | "Quanto costa un sito web per un'attività locale (e cosa include)" | Stessa regola |
| come pubblicizzare la propria attività sui social / su Google | "Come pubblicizzare un'attività locale in provincia di Taranto: social, Google e passaparola" | Aggancio locale |
| come promuovere un reel / un post su Instagram | Aggiornare `sponsorizzate-instagram-attivita-locali` con una sezione "Promuovere un reel" | Aggiornamento, non articolo nuovo |
| differenza tra reel e post (Instagram), già in Search Console in posizione 6-9 | Aggiornare `reel-o-post-cosa-pubblicare-instagram` | Vedi istruzioni all'Addetto al Blog |
| marketing per ristoranti / agenzia marketing per ristoranti / strategie | Già nella lista locale: "Social media per ristoranti in provincia di Taranto" | Inserire "marketing per ristoranti" come keyword secondaria |
| marketing per psicologi, avvocati, commercialisti | Serie "Marketing per professionisti" | Da novembre, uno al mese, con il caso Studio Ricciardi |

## 3. Search Console: conferme
- Ricerche "{città} + agenzia/marketing" già con impressioni: Ferrara (10 varianti), Bari (4 varianti), Polignano, Acquaviva ("realizzazione siti web"), Mottola ("realizzazione siti web").
  → "Realizzazione siti web {città}" va bene come seconda keyword delle pagine siti web.
- Schede clienti trovate per nome: DIRAM, Sublime Tentazione, Sottoscala, Ottica Capone, H28/Paresteta.

## 4. Prossimi passi
1. **Brief a Sito Inlab** per i title per intento: social media manager, web agency, videomaker, fotografo per aziende. File `docs/seo/brief/2026-10-26-title-keyword.md`.
2. **Blog:** 2 articoli "quanto costa" (senza prezzi InLab) e l'aggiornamento di reel-o-post.
3. **Ripetere la ricerca ogni mese** sui paesi nuovi dei lotti e salvarla in questa cartella.
4. **Chiedere a Nicola** se ha un account Google Ads, per i volumi dal Keyword Planner.
