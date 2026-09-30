// Testi alternativi automatici per le foto dei lavori, secondo le regole del
// responsabile SEO (brief 2026-09-30): "{cliente}, {settore} a {città}:
// {servizio} di InLab Communication". Se manca un dato, quel pezzo si omette.
// Mai "foto 1", "foto 2".

const city = (location?: string) => String(location || '').replace(/\s*\([A-Z]{2}\)\s*$/, '').trim();

export function workAlt(c: { name?: string; client?: string; sector?: string; location?: string; services?: string[] }, service?: string): string {
  const name = (c.name || c.client || '').trim();
  const sector = (c.sector || '').trim();
  const where = city(c.location);
  const what = (service || c.services?.[0] || '').trim();
  let head = name;
  if (sector) head += `${head ? ', ' : ''}${sector.toLowerCase()}`;
  if (where) head += `${head ? ' a ' : ''}${where}`;
  const tail = what ? `${what.toLowerCase()} di InLab Communication` : 'lavoro di InLab Communication';
  return head ? `${head}: ${tail}` : tail;
}
