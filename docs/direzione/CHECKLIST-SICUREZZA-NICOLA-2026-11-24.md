# Checklist sicurezza per Nicola (24/11/2026) — in ordine di priorità

Fonte: audit dell'analista del 24/11 + valutazione della copertura. Nessun passo richiede di scrivere password o chiavi in chat: le operazioni si fanno nelle console. Costo: zero, salvo dove indicato.

## 1. Proteggere `main` su GitHub (la più importante, 5 minuti)
Oggi `main` non ha nessuna regola: chi ha un permesso di push può mandare online il sito senza controlli. Lo impedisce solo la regola scritta.
- GitHub → repository `sitoweb` → **Settings → Rules → Rulesets → New ruleset → New branch ruleset**.
- Nome: «main protetto»; Enforcement: **Active**; Target branches: **Include default branch**.
- Attiva: **Restrict deletions**, **Block force pushes**, **Require a pull request before merging** con **Required approvals = 0** (così le pull request si uniscono senza bloccarsi).
- Attiva **Require status checks to pass** e scegli il controllo **Vercel** dall'elenco (se non compare, salta questa riga e dimmelo).
- Salva. Nessun effetto sul pannello admin: la ripubblicazione dalla dashboard usa un Deploy Hook di Vercel (api/publish.ts), non scrive su `main`.

## 2. Verifica in due passaggi (2FA) sugli account
GitHub, Vercel, Google (Firebase), Cloudinary, registrar del dominio, e l'accesso admin del sito se previsto. Controlla anche chi ha accesso: GitHub → Settings → Integrations (app installate) e Deploy keys; Firebase → Impostazioni → Utenti e autorizzazioni; Vercel → Team Members; Cloudinary → utenti. L'account `clinicaricciardilumina-alt` non deve comparire in nessuno.

## 3. Dominio: record DNS (10 minuti, dal registrar)
- SPF: `v=spf1 -all` (il dominio non invia email: blocca le email false a nome InLab).
- DMARC da `quarantine` a `reject`.
- CAA: autorizza solo la certificate authority che usiamo (te la indico quando guardi i record).

## 4. Piano Firebase: Spark (gratis) o Blaze (a consumo)?
Dimmelo: cambia la gravità del problema P1 (statistiche anonime senza limiti: con Spark si può esaurire la quota del giorno e perdere lead).

## 5. Tetto di spesa e chiavi
- Tetto di spesa sulle chiavi dell'intelligenza artificiale (nel pannello del fornitore).
- Chiave Firebase limitata al sito (restrizione per referrer) — aperta dal 01/10.
- Vercel → Settings → Environment Variables: controlla se le chiavi AI sono attive anche in «Preview» (le anteprime userebbero crediti veri); Deployment Protection per la scadenza dei link condivisi.

## 6. Avvisi (a costo zero)
- Avviso di budget su Google Cloud/Firebase (sul piano Blaze).
- Un monitor gratuito che controlla ogni 5 minuti che il sito risponda (es. UptimeRobot) su `/`.

## 7. Backup
Oggi non c'è nessun backup dei dati (lead, contenuti, blog dalla dashboard). Il ripristino del 27/10 è stato possibile solo per una copia fatta a mano il 26/10. Blaze: backup giornalieri di Firestore; Spark: Sito Inlab aggiunge un pulsante «Scarica copia» nella dashboard da usare ogni settimana. Lo propongo a Sito Inlab dopo la tua risposta sul piano.

## 8. Cose che non dipendono da te e che seguo io
P1/P2/P3 (limiti su statistiche, contatti e chat): si decide tra analista e Sito Inlab, poi parte la correzione. Pulizia dei 18 branch vecchi, procedura «richiesta di cancellazione» GDPR e pulizia automatica dei lead oltre 24 mesi (entro il 2028).
