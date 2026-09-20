/**
 * GymPulse Service Worker
 * Gestiona almacenamiento en caché offline y notificaciones Push en segundo plano.
 */

const CACHE_NAME = 'gympulse-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/member',
  '/member/workout',
  '/member/progress',
  '/member/achievements',
  '/member/community',
  '/manifest.json',
  '/icons/icon.svg',
  '/favicon.ico',
];

// 1. Instalación del Service Worker y precaching de assets esenciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activación y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Estrategia de Fetch: Network-First con fallback a Cache para soporte Offline
self.addEventListener('fetch', (event) => {
  // Ignorar peticiones que no sean GET o que sean de esquemas especiales (chrome-extension, etc.)
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  // Rutas de navegación de páginas (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Clonar y actualizar el caché con la versión más reciente
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // Si no hay internet, servir la versión en caché
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback general a la página de miembro o inicio
            return caches.match('/member/workout').then((workoutFallback) => {
              return workoutFallback || caches.match('/member');
            });
          });
        })
    );
    return;
  }

  // Para assets estáticos y estilos: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Recepción de Push Notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'GymPulse',
    body: '¡Tienes una nueva actualización en tu gimnasio!',
    url: '/member',
    tag: 'gympulse-notification',
  };

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icons/icon.svg',
    badge: '/icons/icon.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/member',
    },
    tag: data.tag || 'gympulse-notification',
    actions: [
      { action: 'open', title: 'Ver ahora' },
      { action: 'close', title: 'Cerrar' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 5. Clic en la Notificación: Apertura y navegación a la pantalla correspondiente
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const targetUrl = event.notification.data?.url || '/member';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla y navegar
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Si no hay ventana abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
