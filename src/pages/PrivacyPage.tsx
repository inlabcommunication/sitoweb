// Informativa privacy e cookie (artt. 13-14 GDPR). Testo di base da far
// verificare: aggiornare titolare, P.IVA e tempi di conservazione se cambiano.
import React from 'react';
import { reopenConsent, GA_ID } from '../lib/ga';

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.6rem,3vw,2.2rem)', letterSpacing: '.02em', lineHeight: 1, margin: '2.6rem 0 1rem', textTransform: 'uppercase' }}>{children}</h2>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 15, color: 'rgba(240,237,230,.82)', lineHeight: 1.8, marginBottom: '1rem' }}>{children}</p>
);
const Li = ({ children }: { children: React.ReactNode }) => (
  <li style={{ fontSize: 15, color: 'rgba(240,237,230,.82)', lineHeight: 1.75, marginBottom: '.5rem' }}>{children}</li>
);

export const PagePrivacy: React.FC = () => (
  <section style={{ padding: '10rem 2rem 6rem' }}>
    <div style={{ maxWidth: 820, margin: '0 auto' }}>
      <p className="section-label">Informativa</p>
      <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(3rem,7vw,6rem)', lineHeight: 0.9, marginBottom: '1.5rem' }}>
        PRIVACY<br /><span className="stroke">E COOKIE.</span>
      </h1>
      <P>Questa pagina spiega quali dati raccoglie il sito, perché e come puoi esercitare i tuoi diritti, ai sensi del Regolamento UE 2016/679 (GDPR) e delle linee guida del Garante Privacy sui cookie.</P>

      <H>Titolare del trattamento</H>
      <P>InLab Communication — Castellaneta (TA), Puglia. Email: <a href="mailto:inlab.communication@gmail.com" style={{ color: 'var(--a)' }}>inlab.communication@gmail.com</a> · Telefono: <a href="tel:+393295654319" style={{ color: 'var(--a)' }}>+39 329 565 4319</a>.</P>

      <H>Quali dati raccogliamo</H>
      <ul style={{ paddingLeft: '1.2rem' }}>
        <Li><b>Modulo contatti</b>: nome, email, telefono e azienda (facoltativi), servizio di interesse e messaggio. Li usiamo solo per rispondere alla tua richiesta e, se lo chiedi, per preparare un preventivo. Base giuridica: misure precontrattuali su tua richiesta (art. 6.1.b GDPR).</Li>
        <Li><b>Chat sul sito</b>: i messaggi vengono elaborati da un servizio di intelligenza artificiale (Google Gemini o Anthropic Claude) per generare la risposta e non vengono usati per altri scopi. Se nella chat lasci nome, email o telefono, li salviamo come richiesta di contatto. Non scrivere in chat dati sensibili.</Li>
        <Li><b>Statistiche interne</b>: pagine visitate, tipo di dispositivo e profondità di scorrimento, collegati a un codice di sessione casuale che si cancella alla chiusura del browser. Non identificano la persona e servono solo a migliorare il sito (legittimo interesse, art. 6.1.f).</Li>
        <Li><b>Dati tecnici</b>: per proteggere il sito da abusi (per esempio l'invio massivo di messaggi) l'indirizzo IP viene usato solo in forma cifrata e non reversibile, per limitare il numero di richieste; questi contatori vengono eliminati dopo poche ore.</Li>
        {GA_ID && <Li><b>Google Analytics 4</b> (solo con il tuo consenso): statistiche aggregate sull'uso del sito. Gli annunci personalizzati sono disattivati.</Li>}
      </ul>

      <H>Cookie</H>
      <P><b>Tecnici</b> (sempre attivi): necessari al funzionamento del sito, per esempio per ricordare la tua scelta sui cookie o la sessione della chat. Non richiedono consenso.</P>
      <P><b>Statistici di terze parti</b>{GA_ID ? '' : ' (al momento non attivi)'}: cookie di Google Analytics (<code>_ga</code>, <code>_ga_*</code>, durata fino a 2 anni), installati solo se premi «Accetta» nel banner. Se rifiuti o chiudi il banner non vengono installati. Google Ireland Ltd. tratta i dati come responsabile; eventuali trasferimenti verso gli USA avvengono nell'ambito dell'EU-US Data Privacy Framework.</P>
      {GA_ID && (
        <P><button onClick={() => reopenConsent()} className="btn btn-g" style={{ fontSize: 10, padding: '10px 18px' }}>Modifica le preferenze cookie</button></P>
      )}

      <H>A chi affidiamo i dati</H>
      <P>Per far funzionare il sito usiamo fornitori che trattano i dati per nostro conto: Vercel (hosting), Google Firebase (database), Google e Anthropic (risposte della chat), Cloudinary (immagini e video), Google Analytics (statistiche, solo con consenso). Non vendiamo né cediamo i tuoi dati a terzi per fini di marketing.</P>

      <H>Per quanto tempo</H>
      <P>Le richieste di contatto sono conservate per il tempo necessario a gestirle e comunque non oltre 24 mesi dall'ultimo contatto, salvo che nasca un rapporto di lavoro (in quel caso seguono gli obblighi di legge). Le statistiche interne sono conservate in forma non identificativa.</P>

      <H>I tuoi diritti</H>
      <P>Puoi chiedere in qualsiasi momento di accedere ai tuoi dati, correggerli, cancellarli, limitarne l'uso o opporti al trattamento, e revocare il consenso ai cookie statistici, scrivendo a <a href="mailto:inlab.communication@gmail.com" style={{ color: 'var(--a)' }}>inlab.communication@gmail.com</a>. Hai anche diritto di presentare reclamo al Garante per la protezione dei dati personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--a)' }}>garanteprivacy.it</a>).</P>

      <P><span style={{ fontSize: 12, color: 'var(--m)' }}>Ultimo aggiornamento: 28 settembre 2026.</span></P>
    </div>
  </section>
);
