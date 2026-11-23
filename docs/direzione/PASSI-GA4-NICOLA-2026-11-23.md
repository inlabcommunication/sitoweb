# Passi in Google Analytics (GA4) per gli eventi lead, chatbot e download — da fare dopo il merge della PR #134

Eventi (con consenso ai cookie statistici, senza dati personali):
- `generate_lead` (invio del modulo contatti `method: modulo_contatti, service`; chatbot quando lascia email/telefono `method: chatbot`): una sola volta per invio/conversazione.
- `chatbot_open` (apertura della chat) e `chatbot_message` (primo messaggio scritto dal visitatore, una volta per sessione, parametro `page_path`, nessun testo).
- `download_presentazione` (dopo il modulo di download dei casi studio, parametro `caso`, es. «paresteta»): separato da `generate_lead`.

## Passi
1. Admin → Visualizzazione dati → Eventi: dopo il merge e i primi eventi (fino a 24 ore) compaiono `generate_lead`, `chatbot_message`, `download_presentazione`.
2. Admin → Eventi chiave → «Nuovo evento chiave»: scrivere esattamente `generate_lead` e salvare; ripetere per `chatbot_message`; `download_presentazione` se vuoi contarlo come obiettivo (consiglio sì, separato).
3. Per vedere i parametri nei report: Admin → Definizioni personalizzate → Crea dimensione personalizzata (ambito Evento): `method`, `service`, `page_path` (se non c'è già), `caso`.
4. Prova subito: apri il sito, accetta i cookie statistici, apri la chat e scrivi un messaggio. In Report → Tempo reale, entro 1 minuto, compaiono `chatbot_open` e `chatbot_message`. Per il dettaglio dei parametri: Admin → DebugView, con l'estensione Chrome «Google Analytics Debugger» attiva.
5. Non fare invii veri del modulo contatti per prova; se serve, cancellare poi il lead in dashboard.
