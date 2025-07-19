const CACHE_NAME = 'retro-arcade-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/arcade.js',
  '/style.css',
  '/manifest.json',
  '/space-invaders/index.html',
  '/space-invaders/game.js',
  '/space-invaders/style.css',
  '/snake/index.html',
  '/snake/game.js',
  '/snake/style.css',
  '/pong/index.html',
  '/pong/game.js',
  '/pong/style.css',
  '/tetris/index.html',
  '/tetris/game.js',
  '/tetris/style.css',
  '/asteroids/index.html',
  '/asteroids/game.js',
  '/asteroids/style.css',
  '/pacman/index.html',
  '/pacman/game.js',
  '/pacman/style.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 