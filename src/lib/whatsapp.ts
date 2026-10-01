// Link WhatsApp (wa.me): solo un link, nessuno script esterno, quindi nessuna
// modifica alla CSP. Il numero è lo stesso di BUSINESS.telephone in seo/routes.ts
// (qui ripetuto per non caricare il registro SEO dentro il chatbot).
export const WHATSAPP_NUMBER = '393295654319';

export const whatsappUrl = (text = 'Ciao InLab, vorrei parlarvi di un progetto.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
