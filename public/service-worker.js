self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  // Não cacheia rotas de autenticação, sessão e backend de usuário
  if (
    url.includes('/api/auth') ||
    url.includes('/api/session') ||
    url.includes('/api/getEmail') ||
    url.includes('/User/') ||
    url.includes('/VerificaLogado') ||
    url.includes('/login') ||
    url.includes('/createUser')
  ) {
    // Deixa passar direto para o backend
    return;
  }
  event.respondWith(
    caches.open('gothicmatch-cache').then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          if (event.request.method === 'GET' && networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});