module.exports = {
  slug: 'accessibilita-sito-web-european-accessibility-act',
  hero: {
    tag: 'SITI WEB · NORMATIVA UE',
    title: 'Accessibilità<br>del <span class="acc">sito web</span>',
    size: 62,
    sub: 'Cosa chiede l\'European Accessibility Act alle attività',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="25" y="50" width="380" height="290" rx="20" fill="#262525" stroke="rgba(255,255,255,.12)" stroke-width="2"/>
  <rect x="25" y="50" width="380" height="40" rx="20" fill="rgba(255,255,255,.05)"/>
  ${[0,1,2].map(i=>`<circle cx="${52+i*20}" cy="70" r="6" fill="rgba(255,255,255,.25)"/>`).join('')}
  <text x="55" y="135" font-size="24" font-weight="700" fill="#F0EDE6">Aa</text>
  <rect x="100" y="117" width="180" height="12" rx="6" fill="rgba(240,237,230,.6)"/>
  <rect x="55" y="160" width="140" height="90" rx="10" fill="#2b2440" stroke="rgba(205,178,255,.5)"/>
  <text x="70" y="235" font-size="13" fill="#cdb2ff">alt="..."</text>
  <rect x="215" y="160" width="160" height="36" rx="8" fill="none" stroke="#cdb2ff" stroke-width="3" stroke-dasharray="6 4"/>
  <text x="232" y="184" font-size="14" fill="#F0EDE6">Invia richiesta</text>
  <rect x="215" y="214" width="160" height="36" rx="8" fill="rgba(255,255,255,.06)"/>
  <text x="232" y="238" font-size="13" fill="rgba(240,237,230,.6)">Nome *</text>
  <rect x="95" y="370" width="240" height="60" rx="14" fill="#262525" stroke="rgba(255,255,255,.12)"/>
  <text x="125" y="408" font-size="18" font-weight="700" fill="#cdb2ff">Tab ⇥</text>
  <text x="205" y="408" font-size="15" fill="rgba(240,237,230,.75)">da tastiera</text>
</svg>`
  },
  inline: [
    { type: 'steps', name: 'checklist-accessibilita-sito-web', tag: 'CHECKLIST', title: 'Cosa controllare per primo <span class="acc">sul tuo sito</span>', check: true, cols: 2, items: [
      ['Testi alternativi', 'Ogni immagine utile ha una descrizione'],
      ['Contrasto e testi', 'Leggibili e ingrandibili senza rompere la pagina'],
      ['Navigazione da tastiera', 'Menu, pulsanti e moduli usabili senza mouse'],
      ['Moduli chiari', 'Etichette ed errori spiegati a parole'],
      ['Titoli in ordine', 'Un titolo principale e sottotitoli logici'],
      ['Checkout senza ostacoli', 'Carrello e pagamento con tastiera e lettori di schermo']
    ] },
    { type: 'compare', name: 'accessibilita-seo-sito-web', tag: 'ACCESSIBILITÀ E SEO', title: 'Un sito accessibile <span class="acc">serve a tutti</span>',
      left: { label: 'Per le persone', items: ['Si legge anche con poca vista', 'Si usa senza mouse', 'Moduli facili da compilare', 'Video con sottotitoli'] },
      right: { label: 'Per Google', items: ['Testi alternativi alle immagini', 'Struttura dei titoli chiara', 'Pagine leggibili sul telefono', 'Più richieste di contatto'] } }
  ]
};
