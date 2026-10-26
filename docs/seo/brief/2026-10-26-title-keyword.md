# Brief SEO: title secondo le ricerche reali (26/10/2026)

**Da:** responsabile SEO → **A:** Sito Inlab
**Base:** `docs/seo/keyword/2026-10-26-ricerca-keyword.md`, con le ricerche reali dai suggerimenti di Google. Le persone cercano "social media manager {città}", "web agency {città}", "videomaker {città}" e "fotografo {città}", mentre i nostri title dicono "Gestione social", "Siti Web & Web App", "Video & Reels" e "Foto & Shooting".

## Richieste per lo sviluppo

Cambiano **solo title, description e H1** delle pagine `/{servizio}-{città}`. Gli URL e i testi restano uguali. Un commit per servizio.

1. **`/gestione-social-{città}`**
   - **Title:** "Social media manager a {Città} | Gestione social InLab". Se supera 60 caratteri: "Social media manager a {Città} | InLab".
   - **H1:** "Social media manager e gestione social a {Città}".
   - **Description:** inizia con "Social media manager a {Città}: …".
   - Palagianello ha già un title così: lo usi come modello.
2. **`/siti-web-{città}`**
   - **Title:** "Web agency a {Città}: realizzazione siti web | InLab". Se troppo lungo: "Realizzazione siti web a {Città} | InLab".
   - **H1:** "Realizzazione siti web a {Città}".
   - Palagiano ha già un title personalizzato: va lasciato com'è.
3. **`/video-{città}`**
   - **Title:** "Videomaker a {Città}: video e reel per aziende | InLab". Se troppo lungo: "Videomaker a {Città} | InLab".
   - **H1:** "Videomaker a {Città}: video e reel per aziende".
4. **`/shooting-{città}`**
   - **Title:** "Fotografo per aziende a {Città} | InLab".
   - **H1:** "Fotografo per aziende e attività a {Città}".
   - "Per aziende" va tenuto: serve a non attirare chi cerca fototessere o matrimoni.
5. **Pagine servizio senza città** (`/gestione-social`, `/siti-web`, `/video`, `/shooting`): stessa logica.
   - "Social media manager e gestione social in Puglia | InLab".
   - "Web agency in Puglia: realizzazione siti web | InLab".
   - "Videomaker in Puglia: video e reel per aziende | InLab".
   - "Fotografo per aziende in Puglia | InLab".
6. **Nessun cambio** per `/agenzia-comunicazione-{città}`: il title copre già "agenzia di comunicazione e marketing".

**Controlli:**
- I title restano entro 60 caratteri. Per le città con nome lungo usa la forma corta.
- Nessuna pagina cambia URL o canonical.
- I dati strutturati del Service non cambiano: il nome del servizio può restare quello di oggi.

## Cosa misuro dopo
Search Console tra 3-6 settimane:
- impressioni per "social media manager {città}", "web agency {città}", "videomaker {città}", "fotografo {città}";
- CTR delle pagine servizio-città.
