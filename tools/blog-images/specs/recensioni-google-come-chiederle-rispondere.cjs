module.exports = {
  slug: 'recensioni-google-come-chiederle-rispondere',
  hero: {
    tag: 'GOOGLE · REPUTAZIONE',
    title: 'Recensioni<br><span class="acc">Google</span>',
    size: 66,
    sub: 'Come chiederle ai clienti e come rispondere, anche a quelle negative',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="30" y="40" width="370" height="390" rx="24" fill="#262525" stroke="rgba(255,255,255,.1)" stroke-width="2"/>
  <text x="60" y="88" font-size="20" font-weight="700" fill="#F0EDE6">La tua attività</text>
  <text x="60" y="122" font-size="30" font-weight="700" fill="#cdb2ff">4,8</text>
  ${[0,1,2,3,4].map(i=>`<path transform="translate(${118+i*30},100) scale(1.1)" d="M10 0 L13 7 L20 7 L14.5 11.5 L16.5 19 L10 14.5 L3.5 19 L5.5 11.5 L0 7 L7 7 Z" fill="${i<4?'#cdb2ff':'rgba(205,178,255,.45)'}"/>`).join('')}
  ${[0,1].map(i=>`<rect x="60" y="${160+i*130}" width="310" height="110" rx="14" fill="rgba(255,255,255,.05)"/>
  <circle cx="85" cy="${188+i*130}" r="12" fill="${i?'rgba(255,255,255,.25)':'#cdb2ff'}"/>
  <rect x="106" y="${181+i*130}" width="${i?120:150}" height="10" rx="5" fill="rgba(240,237,230,.55)"/>
  <rect x="80" y="${212+i*130}" width="260" height="8" rx="4" fill="rgba(240,237,230,.25)"/>
  <rect x="96" y="${236+i*130}" width="250" height="22" rx="8" fill="#2b2440" stroke="rgba(205,178,255,.5)"/>
  <text x="108" y="${252+i*130}" font-size="12" fill="#cdb2ff">Risposta del titolare</text>`).join('')}
</svg>`
  },
  inline: [
    { type: 'steps', name: 'chiedere-recensioni-google-clienti', tag: 'CHIEDERE RECENSIONI', title: 'Come chiedere recensioni <span class="acc">nel modo giusto</span>', check: true, cols: 2, items: [
      ['Usa il link della scheda', 'QR code alla cassa, sul tavolo o sullo scontrino'],
      ['Scegli il momento giusto', 'Subito dopo un\'esperienza positiva, anche su WhatsApp'],
      ['Chiedi a tutti', 'Niente filtri: non solo ai clienti contenti'],
      ['Nessun incentivo', 'Niente sconti, omaggi o premi in cambio'],
      ['Richiesta semplice', 'Una frase breve, senza suggerire cosa scrivere'],
      ['Rispondi sempre', 'Alle positive e alle negative, entro pochi giorni']
    ] },
    { type: 'timeline', name: 'rispondere-recensione-negativa-google', tag: 'RECENSIONE NEGATIVA', title: 'Quattro passi per <span class="acc">rispondere bene</span>', items: [
      ['1', 'Ringrazia', 'Anche se il commento è duro'],
      ['2', 'Riconosci', 'Il problema, senza giustificarti troppo', 1],
      ['3', 'Spiega', 'Cosa farai o hai già fatto'],
      ['4', 'In privato', 'Un numero o un\'email per continuare']
    ] }
  ]
};
