# Copia di sicurezza («Scarica copia»), istruzioni per Nicola

## Come scaricarla
1. Dashboard → **Impostazioni** → riquadro **Copia di sicurezza** → **Scarica copia**.
2. Si scarica il file `inlab-copia-AAAA-MM-GG.json` con i contenuti del sito (`site_content`), tutti i lead e tutti gli articoli del blog (anche le bozze).
3. Il messaggio verde dice **«Copia scaricata e completa»**: il numero di lead e articoli nel file è uguale a quello in Firestore. Se il messaggio è rosso, riprova; se si ripete, avvisa Sito Inlab.

## Dove conservarla
- **Il file contiene dati personali** (nomi, email e telefoni dei lead): tienilo in una cartella privata (per esempio il tuo Google Drive personale, non condiviso). Non mandarlo per email o in chat e non caricarlo nel repository.
- Tienila in un posto privato a cui accedi solo tu.
- Tieni le ultime 4 copie e cancella le più vecchie.
- **Richiesta di cancellazione di un contatto** (privacy): oltre a cancellarlo dalla dashboard, cancella i suoi dati anche dalle copie che li contengono ancora (oppure cancella quelle copie).

## Ogni quanto
**Una volta a settimana** (per esempio il lunedì) e **prima di ogni modifica grossa** dalla dashboard.

## Quanto costa
Circa 1 lettura per ogni lead e articolo, più 3 letture: con 100 lead e 20 articoli sono circa 123 letture. Il piano gratuito di Firebase ne consente 50.000 al giorno: una copia alla settimana non pesa.

## Come si ripristina
- **Un testo o un caso studio cancellato per sbaglio:** apri il file con un editor di testo, cerca la parte che serve dentro `site_content` e ricopiala a mano nella dashboard (Editor).
- **Un lead cancellato:** dentro `leads` trovi tutti i campi (nome, email, telefono, messaggio, data); li puoi ricopiare dove ti servono.
- **Un articolo:** dentro `blog_posts` c'è il testo completo; lo ricrei dalla dashboard → Blog.
- **Ripristino completo** (perdita del database): avvisa Sito Inlab, che ti prepara uno script. Lo script usa la chiave di servizio di Firebase e **si lancia dal tuo computer**.
  - La chiave di servizio **non va MAI** incollata in chat, messa nei file del repository o inviata a noi (sessioni Claude comprese).
  - Resta solo sul tuo computer, e solo per il tempo del ripristino.

## Cosa NON c'è nella copia
Le statistiche interne (`analytics_events`), le impostazioni del chatbot (`app/settings`) e i file su Cloudinary (immagini, video, PDF). Quei file restano su Cloudinary.
