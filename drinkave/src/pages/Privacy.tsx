export default function Privacy() {
  return (
    <div className="wrap page stack">
      <a className="back" href="#/parola">← Indietro</a>
      <h1>Informativa privacy</h1>
      <p className="msg info">Testo di esempio: da far verificare e completare dal consulente privacy del locale.</p>
      <p>
        <strong>Titolare del trattamento:</strong> [ragione sociale di Drinkave, indirizzo, P.IVA, email di contatto].
      </p>
      <p>
        <strong>Dati raccolti:</strong> nome, cognome, numero di telefono ed eventualmente email, inseriti da te nel modulo
        “Parola segreta”.
      </p>
      <p>
        <strong>Finalità:</strong> consentirti l’accesso al locale tramite la parola d’ordine e, solo se hai dato il consenso
        facoltativo, inviarti inviti a eventi e promozioni.
      </p>
      <p>
        <strong>Conservazione:</strong> i dati sono conservati su server Google Firebase (UE) per il tempo necessario alle
        finalità indicate e comunque non oltre 24 mesi dall’ultimo accesso.
      </p>
      <p>
        <strong>I tuoi diritti:</strong> puoi chiedere in qualsiasi momento accesso, rettifica o cancellazione dei tuoi dati
        scrivendo a [email]. Hai diritto di proporre reclamo al Garante per la protezione dei dati personali.
      </p>
    </div>
  );
}
