const CACHE_NAME = 'personal-tools-pwa-v5';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico',
  '/favicon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png'
];

// Instalación: Pre-cacheados de recursos base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PWA SW] Precache parcial:', err);
      });
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activación: Limpieza exhaustiva de caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[PWA SW] Purgando cache obsoleto:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Interceptor de peticiones de red
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar peticiones que no sean GET o esquemas no soportados (ej. chrome-extension)
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Las peticiones a Supabase y APIs externas siempre van directo a la red (no cachear auth/db)
  if (url.hostname.includes('supabase.co') || url.pathname.startsWith('/rest/v1/') || url.pathname.startsWith('/auth/v1/')) {
    return;
  }

  // Peticiones de navegación (cargar la página HTML): Network First con fallback a Cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const fallback = await caches.match('/');
          if (fallback) return fallback;
          return new Response('Sin conexión', { status: 503, statusText: 'Service Unavailable' });
        })
    );
    return;
  }

  // Assets estáticos con hash inmutable de Vite (scripts .js, hojas .css, /assets/): Cache First con fallback
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('/assets/')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return networkResponse;
          })
          .catch(() => {
            return new Response('/* Recurso no disponible offline */', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/javascript' },
            });
          });
      })
    );
    return;
  }

  // Recursos estáticos secundarios (imágenes, fuentes, iconos): Stale-While-Revalidate con fallback seguro
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return (
        cachedResponse ||
        fetchPromise ||
        new Response('', { status: 404, statusText: 'Not Found' })
      );
    })
  );
});
