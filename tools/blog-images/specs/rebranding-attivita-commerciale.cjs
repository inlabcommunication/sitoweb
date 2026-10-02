module.exports = {
  slug: 'rebranding-attivita-commerciale',
  hero: {
    tag: 'BRANDING · IDENTITÀ',
    title: 'Rebranding di<br>un\'attività <span class="acc">commerciale</span>',
    size: 60,
    sub: 'Quando serve e come farlo senza perdere i clienti che hai già',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="20" y="70" width="170" height="110" rx="18" fill="#262525" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
  <text x="105" y="133" text-anchor="middle" font-size="26" font-weight="700" fill="rgba(240,237,230,.35)">VECCHIO</text>
  <line x1="40" y1="125" x2="170" y2="125" stroke="rgba(240,237,230,.35)" stroke-width="3"/>
  <path d="M200 125 C 240 125 240 125 250 125" stroke="#cdb2ff" stroke-width="3" fill="none"/>
  <path d="M244 115 l14 10 l-14 10" fill="none" stroke="#cdb2ff" stroke-width="3"/>
  <rect x="265" y="50" width="150" height="150" rx="22" fill="#2b2440" stroke="rgba(205,178,255,.6)" stroke-width="2"/>
  <circle cx="340" cy="110" r="30" fill="#cdb2ff"/>
  <text x="340" y="175" text-anchor="middle" font-size="18" font-weight="700" fill="#F0EDE6">NUOVO</text>
  <rect x="40" y="240" width="350" height="190" rx="22" fill="#262525" stroke="rgba(255,255,255,.1)" stroke-width="2"/>
  <text x="65" y="280" font-size="14" font-weight="700" fill="#F0EDE6">Dove cambiare</text>
  ${['Insegna','Scheda Google','Social','Sito','Menu e packaging'].map((l,i)=>`<circle cx="75" cy="${310+i*24}" r="7" fill="${i<3?'#cdb2ff':'rgba(255,255,255,.2)'}"/><text x="92" y="${315+i*24}" font-size="13" fill="rgba(240,237,230,.75)">${l}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'steps', name: 'checklist-rebranding-insegna-social', tag: 'CHECKLIST DEL CAMBIO', title: 'Cosa aggiornare <span class="acc">il giorno del rebranding</span>', check: true, cols: 2, items: [
      ['Insegna e vetrine', 'Insegna, vetrofanie, targhe e segnaletica'],
      ['Scheda Google', 'Nome, logo e foto: può servire una nuova verifica'],
      ['Profili social', 'Nome, nome utente, immagine, bio e link'],
      ['Sito e dominio', 'Il vecchio indirizzo deve portare al nuovo'],
      ['WhatsApp Business', 'Nome, foto e messaggio di benvenuto'],
      ['Materiali', 'Menu, listini, packaging, divise e biglietti']
    ] },
    { type: 'timeline', name: 'fasi-comunicare-rebranding', tag: 'COMUNICARE IL CAMBIO', title: 'Tre fasi per <span class="acc">non perdere clienti</span>', items: [
      ['Prima', 'Crea attesa', 'Teaser sui social, vetrina, clienti abituali coinvolti'],
      ['Il giorno', 'Un momento preciso', 'Inaugurazione o evento: un motivo per passare', 1],
      ['Dopo', 'Accompagna', '"Prima eravamo…" per qualche mese, poi solo il nuovo nome']
    ] }
  ]
};
