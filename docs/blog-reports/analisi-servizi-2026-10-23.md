# Analisi dei testi dei servizi: 23/10/2026

Richiesta di Nicola tramite il Direttore (P1). Ho solo letto il codice, senza modificarlo.

Testi controllati:
- `src/seo/routes.ts` (SERVICES_SEO, cioè title e description per Google);
- le 7 pagine servizio in `src/App.tsx`, con gli array SERVICES e le StatsRow;
- `src/sections/ServicesOrbScroll.tsx` e `ServicesGrid.tsx`;
- `src/data/serviceExamples.ts`;
- il modello delle pagine servizio + città (`PageCittaSEO` in App.tsx). Ho preso come campione /gestione-social-taranto e /gestione-social-ferrara.

Limite: da questa sessione non posso aprire il sito pubblicato. Le StatsRow sono scritte nel codice: se la dashboard le sostituisce, online potrebbero essere diverse.

Gravità:
- **alta**: promessa o numero che può essere contestato (pratica commerciale ingannevole) o che compare su Google;
- **media**: fatto superato o incoerenza visibile;
- **bassa**: forma.

## 1. Promesse di risultato e numeri

Ognuno di questi numeri va confermato da Nicola. Ma anche se fosse vero, una promessa come "il prossimo video virale è il tuo" va riformulata. Il Codice del Consumo (artt. 20-22, pratiche commerciali ingannevoli) vale anche tra aziende per la pubblicità ingannevole (d.lgs. 145/2007). Le cifre vanno quindi presentate come risultati passati e documentabili, non come promesse.

| Pagina / servizio | Frase | Problema | Gravità | Fonte | Correzione proposta |
|---|---|---|---|---|---|
| Video, description per Google (`routes.ts` SERVICES_SEO) | "fino a milioni di views organiche" | Promessa di risultato nel testo che Google mostra nei risultati | alta | d.lgs. 145/2007; Codice del Consumo artt. 20-22 | "Produzione video e reel per social: idea, riprese, montaggio e caption, con contenuti pensati per essere guardati fino alla fine." |
| Video, hero e card (`SERVICES.short`, PageVideo) | "Abbiamo portato clienti/brand locali a milioni di visualizzazioni organiche" | Numero da documentare. Se è vero, va indicato a chi si riferisce | alta | come sopra | Indicare il cliente e il video, oppure "Alcuni nostri video hanno superato le … visualizzazioni" con il dato reale |
| Video, StatsRow | 3.2M+ views, 840K record, 12 reel virali, ×8 engagement | Numeri da confermare. "×8 vs media" non dice quale media | alta | — | Tenere solo i dati confermati da Nicola, con il periodo di riferimento |
| Video, CTA | "IL PROSSIMO VIDEO VIRALE È IL TUO." | Promessa non garantibile | alta | come sopra | "IL TUO PROSSIMO VIDEO, FATTO BENE." |
| Meta Ads, CTA | "PAGA SOLO I RISULTATI." | **Non corretto.** In Meta Ads la fatturazione avviene per impression o per clic sul link, non per risultato. In più c'è il compenso dell'agenzia | alta | Centro assistenza Meta for Business: "Informazioni sulla fatturazione delle inserzioni" (impression / clic sul link) | "INVESTI DOVE PORTA RISULTATI." oppure "PARTI CON UN BUDGET PICCOLO." |
| Meta Ads, StatsRow | 3.2× ROAS medio, −42% costo per lead, 28 campagne attive, €2M+ budget gestito | Numeri da confermare. "28 campagne attive ora" diventa falso appena cambia | alta | — | Solo dati confermati; niente numeri "in tempo reale" scritti a mano |
| Siti web, StatsRow | "Top 3 – Posizione Google media" | Nessuno può garantire posizioni su Google, e lo dice Google stesso | alta | Google Search Central, "Hai bisogno di un SEO?": nessuno può garantire il primo posto | Togliere, oppure "Siti pensati per la SEO locale" |
| Siti web, StatsRow | "<2s caricamento medio", "98 Score PageSpeed medio" | Da misurare: il PageSpeed varia per pagina e dispositivo | media | PageSpeed Insights (Google) | Mettere i valori misurati dall'addetto performance sui siti consegnati, oppure togliere |
| Social, StatsRow | 3.2M+ views, 47 brand gestiti, +280% crescita follower, 94% rinnovano | Numeri da confermare. Le stesse "3.2M+" compaiono anche nella pagina video | alta | — | Solo dati confermati |
| Shooting, StatsRow | 200+ shooting, 47 brand, **100% clienti soddisfatti**, 48h | "100% soddisfatti" non è dimostrabile; gli altri numeri vanno confermati | media | come sopra | Togliere "100%" e tenere i numeri confermati |
| Automazioni, StatsRow | −60% tempo, +180% lead "senza effort", 24/7, 3 settimane | Numeri da confermare. "senza effort" è un anglicismo | media | — | Tenere solo i dati misurati; "lead gestiti in automatico" |
| Branding, StatsRow | 100% brand guidelines, 48h prime proposte, 3+ revisioni, **∞ file sorgenti** | "∞" non vuol dire niente. I tempi e le revisioni sono impegni contrattuali | media | — | "File sorgenti inclusi"; tempi e revisioni confermati da Nicola |

## 2. Fatti delle piattaforme e della normativa

| Pagina / servizio | Frase | Problema | Gravità | Fonte | Correzione proposta |
|---|---|---|---|---|---|
| Meta Ads, "Vendite e-commerce" | "Campagne Dynamic Product Ads" | Nome superato: oggi si chiamano **inserzioni Advantage+ del catalogo** | media | Meta for Business, Advantage+ catalog ads | "Inserzioni Advantage+ del catalogo, retargeting del carrello abbandonato…" |
| Meta Ads, fase 2 | "dati demografici, interessi, comportamenti… audience lookalike" | Superato in parte: oggi Meta spinge Advantage+ audience, dove interessi e pubblici sono suggerimenti per l'algoritmo. Il nostro articolo `meta-ads-creativita-advantage` dice la stessa cosa | bassa | Meta, "2026: AI Drives Performance" (about.fb.com, gen. 2026) | "Diamo all'algoritmo i segnali giusti: clienti migliori, pubblici simili e suggerimenti di pubblico, con Advantage+ dove conviene." |
| Automazioni, "Chatbot" | "Assistente virtuale… Disponibile 24/7" | Manca un obbligo: dal **2 agosto 2026** chi usa un chatbot deve far sapere all'utente che sta parlando con un sistema AI (AI Act, art. 50). Servono anche l'informativa privacy e la base giuridica per i dati raccolti | media | Regolamento (UE) 2024/1689, art. 50; GDPR artt. 13-14 | Aggiungere: "Il chatbot si presenta come assistente virtuale e rispetta AI Act e GDPR." |
| Automazioni, "Risposta automatica WhatsApp" | chatbot che prenota | Va bene, ma da gennaio 2026 WhatsApp Business ammette solo bot legati al servizio dell'azienda (assistenza, prenotazioni), non assistenti AI generici | bassa | WhatsApp Business Solution Terms | Lasciare il testo così; nel servizio usare solo bot legati all'attività |
| Automazioni, strumenti | "ChatGPT API" | Il prodotto si chiama **OpenAI API**; ChatGPT è l'app | bassa | OpenAI | "API di OpenAI (ChatGPT)" |
| Siti web, tecnologie | "Next.js o WordPress", "WooCommerce o Shopify", "Figma" | Da confermare (vedi sezione 4). Il sito InLab è in React + Vite | bassa | — | Lasciare solo le tecnologie usate davvero |
| Siti web | — | Manca l'accessibilità, che per alcuni clienti è un obbligo dal 28/06/2025 | media | Direttiva (UE) 2019/882, d.lgs. 82/2022 | Nella fase "Sviluppo": "accessibile secondo le linee guida WCAG", con link all'articolo `accessibilita-sito-web-european-accessibility-act` |

## 3. Italiano e coerenza

| Pagina / servizio | Frase | Problema | Gravità | Correzione proposta |
|---|---|---|---|---|
| Branding, "Applicazioni pratiche" | "**Mocku** su social, biglietti da visita…" | Refuso | media | "Mockup per social, biglietti da visita…" |
| Video, "Scrittura dello script" | "il hook dei primi 3 secondi" | Articolo sbagliato | bassa | "l'hook dei primi 3 secondi" |
| Video, "Ottimizzazione per ogni piattaforma" | "il suo comportamento algoritmo" | Manca "dell'" | bassa | "il comportamento del suo algoritmo" |
| Automazioni | "time-consuming", "senza effort", "task" | Anglicismi lontani dal tono del sito | bassa | "che fanno perdere tempo", "in automatico", "attività" |
| Nomi dei servizi in pagine diverse | "Gestione Social" / "Social Media Management" / "Social media management"; "Video & Reels" / "Reel & Video"; "Siti Web & Web App" / "Siti web & landing page"; "Meta Ads" / "Campagne pubblicitarie" | Lo stesso servizio ha nomi diversi tra menu, home (ServicesOrbScroll) e pagine | bassa | Usare ovunque i `label` di SERVICES_SEO |
| Home (ServicesOrbScroll), "Campagne pubblicitarie" | "Meta Ads, **Google Ads**, retargeting" | Google Ads non è tra i 7 servizi. Anche la pagina video cita "Video per campagne Meta Ads e Google Ads" | media | Vedi sezione 4. Se Google Ads non si fa: "Meta Ads e retargeting" |
| Home, "Eventi & inaugurazioni" | porta a /contatti | Non è uno dei 7 servizi e non ha una pagina; va bene, ma è incoerente con l'elenco | bassa | Lasciare, oppure collegarlo a /casi-studio/paresteta |
| `ServicesGrid.tsx` | slug `eventi` → /eventi | Questo file non è importato da nessuna parte (codice morto). Se fosse riattivato, il link /eventi non esiste | bassa | Togliere il file o correggere lo slug |
| Pagine servizio + città (modello) | "Lavoriamo da Castellaneta con attività della provincia di Ferrara: conosciamo stagionalità e abitudini del territorio." | Il modello ripete per ogni città una frase pensata per la provincia di Taranto. Per Ferrara, Bari o Matera è un'esagerazione. Per Ferrara la scheda dice poi che le riprese le fa un collaboratore sul posto, mentre il modello dice "Possiamo venire da voi" | media | Per le città fuori dalla provincia di Taranto, usare un testo apposito, per esempio: "Seguiamo strategia e contenuti a distanza e organizziamo foto e video sul posto." |
| Modello pagine città | "Non vendiamo aria fritta." | Tono molto informale, ripetuto su tutte le pagine città | bassa | "Niente promesse vaghe: definiamo insieme obiettivi chiari…" |

Il campione /gestione-social-taranto non ha altri errori oltre a quelli del modello.

## 4. Da chiedere a Nicola

Non le giudico vere o false: servono le sue conferme.

1. **Tutti i numeri delle StatsRow:**
   - Social: 3.2M+, 47 brand, +280%, 94%;
   - Meta: 3.2× ROAS, −42%, 28 campagne, €2M+;
   - Siti: <2s, 98, Top 3, 100% mobile-first;
   - Automazioni: −60%, 24/7, +180%, 3 settimane;
   - Shooting: 200+, 47, 100%, 48h;
   - Video: 3.2M+, 840K, 12, ×8;
   - Branding: 100%, 48h, 3+, ∞.
   Quali sono veri, su quale periodo e se si possono documentare.
2. **Video:** quale cliente o video ha raggiunto "milioni di visualizzazioni" e quale ha fatto il record di 840K.
3. **Google Ads:** InLab lo offre? Oggi compare nella home e nella pagina video, ma non c'è una pagina servizio.
4. **LinkedIn:** è incluso nella gestione social? I clienti pubblicati sono quasi tutti attività locali B2C.
5. **Cosa è incluso nella gestione social:**
   - "risposte a commenti e DM quotidiani";
   - "A/B test su format e orari";
   - "report mensile";
   - "analisi gratuita del profilo".
6. **Meta Ads:** "ogni settimana un aggiornamento, ogni mese un report"; "ottimizzazione quotidiana del budget".
7. **Siti web:**
   - tecnologie usate davvero (Next.js, WordPress, WooCommerce, Shopify, Figma);
   - "supporto continuo" dopo il lancio: è incluso?
8. **Automazioni:**
   - strumenti usati davvero (Make, Zapier, n8n, Manychat, ActiveCampaign);
   - "formazione del team";
   - "consulenza gratuita di 30 minuti".
9. **Shooting:**
   - "consegna entro 48 ore su Google Drive";
   - "file originali sempre disponibili";
   - "shooting programmato mensile".
10. **Branding:**
    - "prime proposte in 48h", "3+ revisioni incluse", "30 giorni di supporto post-lancio";
    - "template editabili su Canva o Figma";
    - formati dei file (.ai, .svg, .pdf, .png).
11. **Video:** "regia, stabilizzatore, microfoni direzionali, luce aggiuntiva", "qualità cinema", "cast se necessario".

## 5. Richieste per lo sviluppo (per Sito Inlab)

Il codice lo modifica solo Sito Inlab. Priorità:

1. **Alta, si può fare subito senza aspettare Nicola:**
   - `src/seo/routes.ts`, SERVICES_SEO: cambiare la description di `video` con il testo proposto nella sezione 1;
   - App.tsx, PageMetaAds `ServiceCTA`: cambiare "PAGA SOLO I RISULTATI." con "INVESTI DOVE PORTA RISULTATI.";
   - App.tsx, PageVideo `ServiceCTA`: cambiare "IL PROSSIMO VIDEO VIRALE È IL TUO." con "IL TUO PROSSIMO VIDEO, FATTO BENE.";
   - PageSitiWeb StatsRow: togliere "Top 3 – Posizione Google media".
2. **Alta, dopo le risposte di Nicola:** StatsRow delle 7 pagine con solo i numeri confermati. Se un numero non si può confermare, si toglie e al suo posto va una caratteristica del servizio, non un altro numero.
3. **Media:**
   - "Dynamic Product Ads" → "inserzioni Advantage+ del catalogo";
   - nella pagina automazioni, frase su AI Act e GDPR per i chatbot;
   - nella pagina siti, accessibilità WCAG con link all'articolo del blog;
   - refuso "Mocku";
   - modello pagine città per le città fuori dalla provincia di Taranto (vedi sezione 3).
4. **Bassa:**
   - "il hook" → "l'hook"; "comportamento algoritmo" → "del suo algoritmo"; anglicismi; "ChatGPT API" → "API di OpenAI";
   - nomi dei servizi uguali su tutte le pagine;
   - `ServicesGrid.tsx` non usato.
