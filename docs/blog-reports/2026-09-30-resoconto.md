# Resoconto dell'addetto al blog: 29-30 settembre 2026

Per il **responsabile SEO**. Dal 30/09 le regole di `CLAUDE.md` permettono all'addetto al blog di modificare solo `src/data/blogSeed.ts`, `public/blog/`, `docs/blog-brief.md` e `docs/blog-reports/`. Per questo il resoconto è qui e non nei brief in `docs/seo/brief/`, e la mappa "Già coperte" (sezione 10 delle linee guida) va aggiornata da te: le due voci da aggiungere sono indicate sotto. Le mie modifiche precedenti a `docs/seo/` sono state tolte dal mio branch, che ora contiene gli stessi file di `main` in quella cartella.

---

## Resoconto al brief SEO del 29/09/2026

*Compilato il 29/09/2026.*

- **Fatto:**
  - **P1.1 Tabella:** in `quante-volte-pubblicare-social` la tabella DataReportal è diventata un elenco (`- **YouTube:** 41,2 milioni (-2,4%)` …). Ho ricontrollato i numeri sul report *Digital 2026: Italy*: sono invariati. Controllati tutti i 17 articoli: nessuna altra riga che inizia con `|`.
  - **P1.2 Parola chiave nei `##`:** aggiunta nei 6 articoli indicati. Per esempio: "Reel o post su Instagram: a cosa serve ogni formato", "Sponsorizzate su Instagram: 'Metti in evidenza' o Gestione inserzioni", "Contenuti generati con AI: cosa chiede l'articolo 50 dell'AI Act", "Come leggere il report AI Overviews passo passo", "Come collegare Google Business Profile a GA4 e cosa controllare", "WhatsApp Business con l'AI: cosa fa Meta Business Agent".
  - **P1.2 Titoli ripetuti:** il `##` "Cosa cambia/significa per PMI, attività locali e professionisti" non c'è più in nessun articolo. In ogni articolo è diventato un titolo specifico, come `##` o come `###` della sezione precedente (es. "Chi deve adeguare la newsletter: ristoranti, negozi, studi ed e-commerce", "A chi conviene Meta One: e-commerce, negozi e attività locali"). Ho rinominato anche i titoli generici "Cosa è cambiato…", "Perché è importante…" e "Cosa fare in pratica" con titoli che contengono il tema o la parola chiave.
  - **Numero di sezioni:** gli articoli di novità avevano 9-11 `##`, contro le 5-8 della checklist. Ora tutti i 17 articoli hanno 7-8 `##`. "Fonti" è diventato un paragrafo in grassetto con l'elenco; alcuni esempi e casi per settore sono passati a `###`.
  - **P1.3 `coverAlt`:** i 9 articoli ora sono tra 10 e 12 parole; tutti i 17 articoli tra 10 e 15.
  - **P1.4 `updated`:** tolto da `sponsorizzate-instagram-attivita-locali` e `idee-reel-ristoranti`. Nessun `updated` aggiunto sugli articoli corretti.
  - **P2 Articoli nuovi** (data 29/09/2026, senza `updated`, copertina JPG 1600×900 e 2 infografiche ciascuno):
    - `servizio-fotografico-ristoranti`, Ilaria Gemma, circa 1.500 parole, 8 `##`, FAQ 5. Link a `/shooting`, `/contatti`, `idee-reel-ristoranti` (e da `idee-reel-ristoranti` verso di lui), clienti [Sottoscala](/cliente/sottoscala) e [Villa Natia](/cliente/villa-natia) con i soli dati della loro scheda (Aleph Caffè sostituito il 29/09 su indicazione di Nicola: non va citato nel blog). C'è la sezione "Da cosa dipende il costo" senza cifre, come da sezione 7.
    - `rebranding-attivita-commerciale`, Nicola Carpignano, circa 1.370 parole, 8 `##`, FAQ 5. Link a `/branding`, `/casi-studio/paresteta`, `/contatti` e all'articolo sito o social. Il caso Paresteta usa solo testi già pubblicati (fasi, QR code, video, evento, risultato qualitativo); le metriche "da confermare" non ci sono.
  - **P4:** link verso `servizio-fotografico-ristoranti` da `idee-reel-ristoranti` e verso `rebranding-attivita-commerciale` da `gestione-social-attivita-locale-cosa-include` (paragrafo su Paresteta). Mappa "Già coperte" aggiornata per Foto & Shooting e Branding. Controllo finale: 17 articoli, nessun link interno rotto, nessun articolo senza link in ingresso, `tsc` ok.

- **Non fatto e perché:**
  - **P3 AGCOM influencer:** non scritto. agcom.it è bloccato dalla rete di questo ambiente, quindi non posso verificarlo sulla fonte ufficiale come chiede il brief. Lo riprendo quando la verifica è possibile.
  - **Build completa:** npm non installa le dipendenze in questo ambiente; il file degli articoli passa `tsc`.

- **Cosa ho imparato dalle ricerche SEO:**
  - *servizio fotografico per ristoranti*: i primi 5 risultati sono guide di fotografi e piattaforme (Deliveroo, Plateform, HorecaNews). Coprono pulizia, luce naturale, due porzioni per i piatti delicati, foto ambientate e coerenza del menu. **Manca** come usare le foto su ogni canale (menu, delivery, Instagram con formati 4:5 e 9:16, scheda Google, sito), l'idea di girare foto e video nella stessa giornata e la stagionalità. L'ho aggiunto. Varianti trovate nei titoli: "fotografo per ristoranti" e "foto per il menu", con intento più commerciale (pagine servizio). **Proposta:** "fotografo per ristoranti" è adatta alle pagine `/shooting-<città>`, non al blog.
  - *rebranding attività commerciale*: i primi risultati sono guide generiche per aziende (TEAM LEWIS, Pixela, Shopify, Raffaele Gaito), con passaggi di strategia e comunicazione in fasi. **Manca** la parte pratica per un'attività locale: insegna, scheda Google (nome, nuova verifica, recensioni che restano sulla stessa scheda), dominio con reindirizzamento, WhatsApp Business, materiali in negozio. L'ho aggiunto, con un caso locale reale.
  - Da aggiungere alla sezione 11, se sei d'accordo: *per i temi "come fare" i primi risultati sono spesso scritti per aziende grandi; la checklist operativa per l'attività locale è il pezzo mancante che possiamo dare noi.*

- **Dubbi o proposte per il responsabile SEO:**
  1. **Categoria per le foto.** Tra le 5 categorie non ce n'è una per foto e shooting: ho usato "Social media" per `servizio-fotografico-ristoranti`. Se prevedi altri articoli sul tema, propongo una categoria "Foto & Branding" (va aggiunta in `BLOG_CATEGORIES`, cioè nel codice: è compito tuo).
  2. **Titoli `##` con parola chiave.** Negli articoli di novità ho messo la parola chiave in uno o due `##`, non in tutti, per non forzare il testo. Dimmi se preferisci una regola più precisa (per esempio "nel primo `##` dopo l'introduzione").
  3. **Esperienza InLab negli articoli di novità.** Resta generica finché Nicola non manda le informazioni sui clienti; ha chiesto di aspettarle.
  4. **Pubblicazione su `main` (tuo punto 3).** Da ora consegno solo sul mio branch, come chiedi. Nicola ha confermato il 29/09; la routine che pubblicava da sola alle 11:50 è disattivata. Le due pubblicazioni dirette del 28 e 29/09, compresa la sostituzione di Aleph Caffè con Villa Natia chiesta da Nicola, erano state autorizzate da lui all'inizio del lavoro.

**Voci da aggiungere alla mappa "Già coperte" (sezione 10):**
- Foto & Shooting: *servizio fotografico per ristoranti* → `servizio-fotografico-ristoranti`
- Branding & Identità: *rebranding attività commerciale* → `rebranding-attivita-commerciale`

---

## Resoconto al messaggio del 30/09/2026 (immagini SEO e GEO)

Il brief del 30/09 e la sezione 8 aggiornata delle linee guida non sono ancora su `main`. Ho lavorato sulle indicazioni del tuo messaggio.

- **Fatto:**
  - **Metadati IPTC** in tutte le 41 immagini del blog (17 copertine JPG e 24 infografiche WebP), con autore "InLab Communication", copyright "© InLab Communication" e crediti "InLab Communication":
    - JPEG: XMP (`dc:creator`, `dc:rights`, `photoshop:Credit`) e IPTC IIM (By-line, Credit, Copyright Notice, set di caratteri UTF-8);
    - WebP: XMP nel chunk `XMP `, con il flag nel chunk `VP8X`.
  - **Aspetto identico, verificato:** i metadati sono aggiunti ai file senza ricomprimerli. Ho confrontato le 41 immagini prima e dopo, decodificandole in Chromium pixel per pixel: 0 differenze. Peso: +1 KB circa per file.
  - **Testo alternativo delle infografiche:** 13 superavano le 15 parole (fino a 29). Ora tutte le 24 sono tra 8 e 15 parole e descrivono il contenuto. I `coverAlt` delle 17 copertine erano già tra 10 e 15.
  - **Pesi e dimensioni:** copertine JPG 1600×900 fino a 118 KB (limite 250); infografiche WebP larghe 1200 px, fino a 62 KB (limite 150).
- **Non fatto e perché:**
  - **Metadati nel generatore `tools/blog-images`:** la cartella non è nella mia area (`CLAUDE.md`). Ho aggiunto i metadati ai file già generati; per le immagini future serve la modifica al generatore, vedi "Richieste per lo sviluppo".
  - **Nomi dei file:** quasi tutti sono già descrittivi (`piano-settimanale.webp`, `ottimizzare-video-ricerca.webp`…). Restano generici i 4 `checklist.webp` e i due `formati.webp`, anche se stanno nella cartella con lo slug. Non li ho rinominati: cambierebbe l'indirizzo delle immagini già pubblicate. Se la sezione 8 aggiornata lo richiede, li rinomino con la prossima consegna.
- **Dubbi o proposte:**
  1. `CLAUDE.md` e le linee guida sono in contrasto su due punti: il resoconto "nel brief" e l'aggiornamento della mappa da parte dell'addetto al blog. Propongo che il resoconto stia sempre in `docs/blog-reports/AAAA-MM-GG-resoconto.md` e che tu lo riporti o lo linki nel brief.
  2. La consegna è sul mio branch `claude/optimistic-ritchie-mj87ne`. Per andare online serve la pull request verso `main`, come previsto da `CLAUDE.md`.

## Richieste per lo sviluppo

**Per la sessione Sito Inlab.** File: `tools/blog-images/render.cjs` (oppure un passaggio finale in `gen.cjs`).
**Motivo:** richiesta del responsabile SEO del 30/09. Google Immagini mostra come crediti i metadati IPTC. Oggi le immagini nuove escono senza, e l'addetto al blog non può modificare `tools/`.
**Proposta:** dopo aver scritto ogni file, aggiungere i metadati con lo script qui sotto. Non ricomprime l'immagine: inserisce un segmento APP1 (XMP) e APP13 (IPTC IIM) nei JPEG, un chunk `XMP ` nei WebP. Si può anche lasciare in Python e chiamarlo dopo `gen.cjs`, oppure portarlo in JavaScript. Verificato su 41 file: pixel identici, file validi in Chromium.

```python
# Aggiunge metadati IPTC (IIM) e XMP a JPEG e WebP senza ricomprimere i pixel.
# Uso: python3 iptc.py file1.jpg file2.webp ...
import struct, sys

CREATOR = 'InLab Communication'
CREDIT = 'InLab Communication'
COPYRIGHT = '© InLab Communication'

XMP = f'''<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">
   <dc:creator><rdf:Seq><rdf:li>{CREATOR}</rdf:li></rdf:Seq></dc:creator>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">{COPYRIGHT}</rdf:li></rdf:Alt></dc:rights>
   <photoshop:Credit>{CREDIT}</photoshop:Credit>
   <xmpRights:Marked>True</xmpRights:Marked>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>'''.encode('utf-8')

XMP_NS = b'http://ns.adobe.com/xap/1.0/\x00'


def iim():
    def ds(rec, tag, val):
        return b'\x1c' + bytes([rec, tag]) + struct.pack('>H', len(val)) + val
    data = ds(1, 90, b'\x1b%G')  # set di caratteri UTF-8
    data += ds(2, 80, CREATOR.encode()) + ds(2, 110, CREDIT.encode()) + ds(2, 116, COPYRIGHT.encode())
    res = b'8BIM' + struct.pack('>H', 0x0404) + b'\x00\x00' + struct.pack('>I', len(data)) + data
    if len(data) % 2:
        res += b'\x00'
    return b'Photoshop 3.0\x00' + res


def seg(marker, payload):
    return b'\xff' + bytes([marker]) + struct.pack('>H', len(payload) + 2) + payload


def jpeg(buf):
    assert buf[:2] == b'\xff\xd8'
    if XMP_NS in buf[:4096]:
        return None  # già fatto
    i = 2
    # dopo APP0 (JFIF) se presente
    if buf[2:4] == b'\xff\xe0':
        i = 4 + struct.unpack('>H', buf[4:6])[0]
    return buf[:i] + seg(0xE1, XMP_NS + XMP) + seg(0xED, iim()) + buf[i:]


def webp(buf):
    assert buf[:4] == b'RIFF' and buf[8:12] == b'WEBP'
    chunks, i = [], 12
    while i < len(buf):
        cid = buf[i:i+4]; size = struct.unpack('<I', buf[i+4:i+8])[0]
        chunks.append([cid, buf[i+8:i+8+size]]); i += 8 + size + (size & 1)
    if any(c[0] == b'XMP ' for c in chunks):
        return None
    if chunks[0][0] != b'VP8X':
        # immagine semplice: serve il chunk VP8X con le dimensioni
        c = chunks[0]
        if c[0] == b'VP8 ':
            w = struct.unpack('<H', c[1][6:8])[0] & 0x3fff; h = struct.unpack('<H', c[1][8:10])[0] & 0x3fff
        else:  # VP8L
            b = struct.unpack('<I', c[1][1:5])[0]; w = (b & 0x3fff) + 1; h = ((b >> 14) & 0x3fff) + 1
        vp8x = bytes([0, 0, 0, 0]) + (w - 1).to_bytes(3, 'little') + (h - 1).to_bytes(3, 'little')
        chunks.insert(0, [b'VP8X', vp8x])
    flags = bytearray(chunks[0][1]); flags[0] |= 0x04; chunks[0][1] = bytes(flags)
    chunks.append([b'XMP ', XMP])
    body = b''.join(c[0] + struct.pack('<I', len(c[1])) + c[1] + (b'\x00' if len(c[1]) & 1 else b'') for c in chunks)
    return b'RIFF' + struct.pack('<I', 4 + len(body)) + b'WEBP' + body


for f in sys.argv[1:]:
    b = open(f, 'rb').read()
    out = jpeg(b) if f.endswith('.jpg') else webp(b)
    if out is None:
        print('già presente', f); continue
    open(f, 'wb').write(out)
    print(f'{f}: {len(b)//1024} KB -> {len(out)//1024} KB')
```
