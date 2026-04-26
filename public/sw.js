const CACHE_NAME = 'coach-life-v1';
const urlsToCache = [
  '/',
  '/src/main.js',
  '/src/style.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/favicon-32x32.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // Ne pas intercepter les appels API
  if (event.request.url.includes('/api/') || event.request.url.includes('/auth/') || event.request.url.includes('/days/') || event.request.url.includes('/concepts/') || event.request.url.includes('/patterns') || event.request.url.includes('/push/') || event.request.url.includes('/health')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return fetchResponse;
      }).catch(() => {
        // Fallback pour les routes de navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Coach Life';
  const options = {
    body: data.body || "C'est l'heure de ton focus !",
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: data.tag || 'reminder',
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Ouvrir' },
      { action: 'dismiss', title: 'Ignorer' },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      if (clientList.length > 0) {
        clientList[0].focus();
        return;
      }
      clients.openWindow('/');
    })
  );
});
