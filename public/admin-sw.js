// Service worker della dashboard: mostra le notifiche push dei nuovi lead.
// Registrato solo da /admin (scope /admin), non tocca il sito pubblico.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data && event.data.text() }; }
  event.waitUntil(self.registration.showNotification(data.title || 'Nuova lead', {
    body: data.body || 'Apri la dashboard per i dettagli',
    icon: '/icon-192.png',
    badge: '/favicon-48.png',
    tag: 'lead-' + Date.now(),
    data: { url: data.url || '/admin' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || '/admin', self.location.origin).href;
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const open = all.find((c) => c.url.startsWith(self.location.origin + '/admin'));
    if (open) { await open.focus(); return open.navigate ? open.navigate(url).catch(() => {}) : undefined; }
    return self.clients.openWindow(url);
  })());
});
