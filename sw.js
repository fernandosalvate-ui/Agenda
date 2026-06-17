const CACHE = 'meudiaV1';
const ASSETS = ['./index.html', './manifest.json'];

// ── INSTALL: cache assets ──
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// ── ACTIVATE ──
self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// ── FETCH: serve from cache when offline ──
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// ── NOTIFICATION CLICK ──
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length) return list[0].focus();
      return clients.openWindow('./index.html');
    })
  );
});

// (Agendamento agora é feito ativamente pelo app via checagem periódica,
// que chama self.registration.showNotification diretamente)
