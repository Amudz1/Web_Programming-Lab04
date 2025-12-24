const CACHE_NAME = 'fashion-shop-v1';
const urlsToCache = [
  './',
  './index.html',
  './products.html',
  './product-detail.html',
  './cart.html',
  './checkout.html',
  './coming-soon.html',
  './contacts.html',
  './team.html',
  './css/style.css',
  './js/app.js',
  './js/cart.js',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.2/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.2/js/bootstrap.bundle.min.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('[ServiceWorker] Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Обработка запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем из кеша если есть
        if (response) {
          console.log('[ServiceWorker] Found in cache:', event.request.url);
          return response;
        }

        // Если нет в кеше, запрашиваем из сети
        return fetch(event.request).then(response => {
          // Проверяем валидность ответа
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Клонируем ответ для кеша
          const responseToCache = response.clone();

          // Кешируем изображения и CSS
          if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|css)$/)) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        });
      })
      .catch(err => {
        console.log('[ServiceWorker] Fetch failed:', err);
        // Можно вернуть offline страницу
      })
  );
});