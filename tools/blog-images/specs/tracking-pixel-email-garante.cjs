module.exports = {
  slug: 'tracking-pixel-email-garante',
  hero: {
    tag: 'PRIVACY · EMAIL MARKETING',
    title: 'Pixel nelle email:<br>serve il <span class="acc">consenso</span>',
    size: 64,
    sub: 'Le linee guida del Garante e cosa fare entro fine ottobre 2026',
    visual: `<svg viewBox="0 0 430 470" width="430" height="470" font-family="'Liberation Sans'">
  <rect x="30" y="40" width="370" height="300" rx="28" fill="#262525" stroke="rgba(255,255,255,.1)" stroke-width="2"/>
  <path d="M30 80 L215 210 L400 80" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/>
  <rect x="70" y="120" width="170" height="12" rx="6" fill="rgba(240,237,230,.18)"/>
  <rect x="70" y="146" width="120" height="12" rx="6" fill="rgba(240,237,230,.12)"/>
  <rect x="70" y="250" width="230" height="10" rx="5" fill="rgba(240,237,230,.1)"/>
  <rect x="70" y="272" width="190" height="10" rx="5" fill="rgba(240,237,230,.1)"/>
  <rect x="330" y="268" width="16" height="16" rx="3" fill="#cdb2ff"/>
  <circle cx="338" cy="276" r="22" fill="none" stroke="#cdb2ff" stroke-width="2" stroke-dasharray="4 5"/>
  <path d="M338 298 L338 372" stroke="#cdb2ff" stroke-width="2" stroke-dasharray="5 6"/>
  <rect x="90" y="372" width="300" height="70" rx="35" fill="#262525" stroke="rgba(205,178,255,.45)" stroke-width="2"/>
  <text x="120" y="413" font-size="17" font-weight="700" fill="#F0EDE6">Tracciamento aperture</text>
  <rect x="316" y="390" width="58" height="34" rx="17" fill="rgba(255,255,255,.1)"/>
  <circle cx="334" cy="407" r="13" fill="#F0EDE6" opacity=".7"/>
  <text x="120" y="432" font-size="12" fill="rgba(240,237,230,.5)">solo con il tuo consenso</text>
</svg>`
  },
  inline: [
    { type: 'steps', name: 'checklist', tag: 'NEWSLETTER · CHECKLIST', title: 'Da fare entro <span class="acc">fine ottobre 2026</span>', check: true, cols: 2, items: [
      ['Mappa i pixel', 'Newsletter, DEM, automazioni: dove registri le aperture?'],
      ['Controlla la piattaforma', 'Il dato di apertura è legato al singolo indirizzo?'],
      ['Consenso separato', 'Una casella dedicata al tracciamento, non preselezionata'],
      ['Informativa chiara', 'Spiega cosa sono i pixel e come rinunciarvi'],
      ['Revoca granulare', 'Disiscrizione completa oppure stop al solo tracciamento'],
      ['Nuovi KPI', 'Clic, risposte e conversioni al posto dell\'open rate']
    ] }
  ]
};
