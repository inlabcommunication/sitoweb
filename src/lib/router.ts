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
  if (path !== window.location.pathname) window.history.pushState(null, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

/** onClick per <a href> interni: naviga senza ricarica, ma lascia funzionare ctrl/cmd+click. */
export const linkClick = (handler: () => void) => (e: { preventDefault: () => void; metaKey?: boolean; ctrlKey?: boolean; shiftKey?: boolean; button?: number }) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
  e.preventDefault();
  handler();
};
