# Prestazioni dei concorrenti — 01/10/2026

Addetto performance, su richiesta dell'Analisi competitor (via titolare).

## Metodo

- Lighthouse 12 in modalità mobile: Moto G simulato, 4G lento con throttling simulato, CPU rallentata 4×. Sono gli stessi criteri usati per InLab.
- Solo la home di ogni sito, 2 prove per sito, 01/10 tra le 06:52 e le 07:05 UTC. InLab misurata alla stessa ora come riferimento.
- Niente PageSpeed Insights: non c'è una chiave API, quindi non ci sono nemmeno i dati reali CrUX.
- Le misure di laboratorio variano da una prova all'altra. Le differenze piccole (±10 punti) non vanno lette come significative.

## Risultati

| Sito | Perf. | LCP | TBT | CLS | Accessibilità | Peso pagina | Elemento più pesante |
|---|---|---|---|---|---|---|---|
| **InLab** (riferimento) | **94** (94–100 il 30/09) | **1,3 s** | 250 ms | 0,039 | 96 | 1,5 MB | cover del blog nella griglia "Instagram" (~110 KB l'una, 9 file) |
| Forte e Chiaro Studio | 78 / 95 | 1,4–1,6 s | 230–690 ms | 0 | 96 | 1,1 MB | foto da 343 KB (`/api/media/…dscf7347`) |
| Vyon Solutions | 52 / 54 | 12,4–12,6 s | 400–420 ms | 0,005 | 91 | 2,8 MB | immagine da 766 KB (`SportelloAI…`); il titolo H1 compare in ritardo per un'animazione |
| Saphira Communication (Wix) | 44 / 51 | 6,9–7,4 s | 640–1.010 ms | 0,028 | 90 | 1,9 MB | video Wix da 323 KB; l'LCP è il poster del video |
| Devision Comm | 40 / 40 | 12,4–13,3 s | 1.790–2.440 ms | 0,013–0,014 | 85 | 1,2 MB | Google Tag Manager, 177 KB; sito Elementor |
| Mediabrand | 11 / 21 | 5,4–19,7 s | 1.600–1.940 ms | **0,59** (scarso) | 72–94 | 2,3–7,9 MB | feed Instagram (immagini fino a 603 KB) e reCAPTCHA (346 KB) |

Soglie Google per l'LCP: buono fino a 2,5 s, scarso oltre 4 s. Per il CLS: buono fino a 0,1, scarso oltre 0,25.

## Note per sito

- **Vyon Solutions**: nessuna pagina di verifica anti-bot. Lighthouse ha ricevuto la home normale (URL finale `https://www.vyonsolutions.com/`).
- **Mediabrand**: connessione instabile durante le prove (reset nel proxy del mio ambiente). Le due prove sono molto diverse: nella seconda è stato caricato tutto il feed Instagram, 7,9 MB. In entrambe la pagina si sposta molto mentre carica (CLS 0,59).
- **Devision Comm**: l'LCP alto è un blocco Elementor visibile solo su mobile (`elementor-hidden-desktop`) che compare tardi. Molto JavaScript: TBT oltre 1,7 s.
- **Saphira**: sito Wix, LCP lento come spesso accade con i video in apertura.

## Lettura per il confronto

- **I dati di InLab nel report competitor vanno aggiornati.** "Home 46–71, video da 45,9 MB, LCP del blog 5,2 s" era la situazione del 30/09 mattina.
  - Dopo le correzioni del 30/09 la home mobile è a 94–100 con LCP 1,2–2,2 s.
  - Il video è servito ridotto (~3 MB, scaricato solo quando la sezione è visibile).
  - Il blog è a 98 con LCP 1,6–1,8 s.
  - Dettagli in `docs/performance/2026-09-30.md`.
- Oggi InLab è il sito più veloce del gruppo su mobile, alla pari con Forte e Chiaro Studio. Gli altri quattro hanno LCP da "scarso" (oltre 4 s).
- Unico punto in cui InLab non è il migliore: il peso della pagina (1,5 MB), per via delle cover del blog nella griglia Instagram. La correzione è già richiesta a Sito Inlab: obiettivo sotto 600 KB.
