# Drinkave — web app dello speakeasy

App per i clienti (installabile sul telefono) + area di gestione.

**Per i clienti**
- **Menu** con categorie, prezzi, ingredienti ed etichette.
- **Parola segreta**: ci si iscrive con nome, cognome, telefono (email facoltativa) oppure si accede con il numero già registrato, e si scopre la parola d’ordine. Su quel dispositivo resta sbloccata.
- **News**: articoli, eventi, novità (con immagine facoltativa).
- **Podcast**: episodi da YouTube che si guardano **dentro l’app** (player incorporato, niente salto su YouTube).
- **Notifiche push** (Android/desktop subito; su iPhone dopo “Aggiungi alla schermata Home”, iOS 16.4+).

**Gestione** (`/#/gestione`, accesso con email e password)
- Panoramica con numeri principali.
- Modifica **menu**, **parola segreta** (con avviso push opzionale), **news**, **podcast** (basta incollare il link YouTube).
- **Clienti**: elenco con ricerca, filtro consenso marketing, eliminazione e **download Excel (.xlsx)**.
- **Invio notifiche** a tutti i dispositivi iscritti.

## Provarla subito (modalità demo)

Senza configurazione Firebase l’app parte in **modalità demo**: tutto funziona, ma i dati restano nel browser. In gestione si entra con qualsiasi email/password.

```bash
npm install
npm run dev
```

## Mettere online (Firebase + Vercel)

1. **Firebase** (console.firebase.google.com) → nuovo progetto, regione UE.
   - *Authentication* → abilita **Anonimo** ed **Email/password**. In *Users* crea l’utente del titolare.
   - *Firestore Database* → crea il database (es. `eur3`). In *Regole* incolla `firestore.rules` e pubblica.
   - In Firestore crea a mano la raccolta **`admins`** con un documento il cui ID è l’**UID** dell’utente del titolare (campo qualsiasi, es. `nome: "Titolare"`). Solo questi utenti entrano in gestione.
   - *Impostazioni progetto → Le tue app* → aggiungi app Web e copia i valori nelle variabili `VITE_FIREBASE_*`.
   - *Cloud Messaging → Certificati push web* → genera la coppia di chiavi e copia la chiave pubblica in `VITE_FIREBASE_VAPID_KEY`.
   - *Account di servizio* → “Genera nuova chiave privata”: il JSON va in `FIREBASE_SERVICE_ACCOUNT` (solo su Vercel, mai nel repository).
2. **Vercel** → nuovo progetto da questo repository con **Root Directory = `drinkave`**, aggiungi le variabili di `.env.example`, deploy.
3. Dalla gestione: imposta la parola, il menu e il primo episodio.

## Dati (Firestore)

| Raccolta | Contenuto | Chi legge |
|---|---|---|
| `contenuti/menu` | menu completo | tutti |
| `news`, `podcast` | articoli ed episodi | tutti (solo pubblicati) |
| `segreto/parola` | parola d’ordine | solo iscritti e admin |
| `clienti` | anagrafica iscritti | solo admin |
| `telefoni`, `accessi` | indici per riconoscere gli iscritti | nessuno (solo regole) |
| `pushTokens` | dispositivi con notifiche attive | solo server |
| `admins` | chi può gestire | ognuno solo il proprio |

## Note

- La parola è “segreta” rispetto a chi non si iscrive: chiunque lasci nome e telefono la vede (è lo scopo). I dati dei clienti invece non sono mai leggibili dal pubblico.
- L’informativa privacy in `src/pages/Privacy.tsx` è un modello: va completata con i dati del titolare e verificata.
- Il telefono non viene verificato via SMS: si può aggiungere in seguito (Firebase Phone Auth, a pagamento oltre la soglia gratuita).
