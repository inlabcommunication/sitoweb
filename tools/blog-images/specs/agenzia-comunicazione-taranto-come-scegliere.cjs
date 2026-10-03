module.exports = {
  slug: 'agenzia-comunicazione-taranto-come-scegliere',
  hero: {
    tag: 'STRATEGIA · TARANTO',
    title: 'Scegliere un\'agenzia<br>di comunicazione<br>a <span class="acc">Taranto</span>',
    size: 58,
    sub: '7 domande da fare prima di firmare',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="30" y="30" width="370" height="410" rx="24" fill="#262525" stroke="rgba(255,255,255,.1)" stroke-width="2"/>
  <text x="60" y="80" font-size="16" font-weight="700" letter-spacing="2" fill="#cdb2ff">PRIMA DI FIRMARE</text>
  ${['Lavori simili in zona','Chi segue il progetto','Cosa è incluso','Riprese sul posto','Come si misura','Account a tuo nome','Durata e uscita'].map((l,i)=>`<rect x="58" y="${108+i*45}" width="24" height="24" rx="6" fill="${i<4?'#cdb2ff':'none'}" stroke="#cdb2ff" stroke-width="2"/>${i<4?`<path d="M64 ${120+i*45} l5 5 l9 -10" stroke="#1a1919" stroke-width="3" fill="none"/>`:''}<text x="96" y="${126+i*45}" font-size="17" fill="rgba(240,237,230,${i<4?'.9':'.6'})">${i+1}. ${l}</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'steps', name: 'domande-scegliere-agenzia-comunicazione-taranto', tag: 'PRIMA DI FIRMARE', title: '7 domande per scegliere <span class="acc">l\'agenzia giusta</span>', check: true, cols: 2, items: [
      ['Lavori simili, in zona', 'Profili, video e siti veri, con il nome dell\'attività'],
      ['Chi segue il progetto', 'Un referente unico e come contattarlo'],
      ['Cosa fate voi, cosa resta a me', 'Contenuti inclusi e tempo richiesto al titolare'],
      ['Riprese sul posto', 'Foto e video veri, nella tua attività'],
      ['Come si misurano i risultati', 'Richieste, chiamate, prenotazioni: report chiari'],
      ['Account a tuo nome', 'Profili, scheda Google, ads e dominio intestati a te'],
      ['Durata e uscita', 'Rinnovo e preavviso chiari, meglio un periodo di prova']
    ] },
    { type: 'compare', name: 'segnali-scelta-agenzia-comunicazione', tag: 'IL PRIMO INCONTRO', title: 'Buoni segnali e <span class="acc">campanelli d\'allarme</span>',
      left: { label: 'Campanelli d\'allarme', items: ['Risultati garantiti in poco tempo', 'Lo stesso pacchetto per tutti', 'Nessun lavoro vero da mostrare', 'Account intestati all\'agenzia'] },
      right: { label: 'Buoni segnali', items: ['Tante domande sulla tua attività', 'Lavori veri, con nomi e link', 'Pochi obiettivi chiari', 'Cosa si misura, spiegato prima'] } }
  ]
};
