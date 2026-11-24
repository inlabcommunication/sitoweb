// Routing con URL "vere" (History API) invece di #/…: ogni pagina ha il suo
// indirizzo e Google può indicizzarla separatamente.

const normalize = (path: string) => {
  const clean = path.split(/[?#]/)[0] || '/';
  return clean.length > 1 ? clean.replace(/\/+$/, '') : '/';
};

/** Percorso attuale. I vecchi link /#/pagina vengono convertiti in /pagina. */
export const getCurrentPath = (): string => {
  const { hash, pathname } = window.location;
  if (hash.startsWith('#/')) {
    const legacy = normalize(hash.slice(1));
    window.history.replaceState(null, '', legacy);
    return legacy;
  }
  return normalize(decodeURI(pathname));
};

/** Naviga senza ricaricare la pagina; App ascolta l'evento popstate. */
export const navigate = (to: string) => {
  const path = normalize(to);
  // la query resta nell'indirizzo (es. /contatti?servizio=gestione-social, brief SEO 12/11 GS-2);
  // la pagina mostrata dipende solo dal percorso
  const query = to.match(/\?[^#]*/)?.[0] || '';
  if (path + query !== window.location.pathname + window.location.search) window.history.pushState(null, '', path + query);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

/** onClick per <a href> interni: naviga senza ricarica, ma lascia funzionare ctrl/cmd+click. */
export const linkClick = (handler: () => void) => (e: { preventDefault: () => void; metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; button?: number }) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
  e.preventDefault();
  handler();
};
