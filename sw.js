const CACHE_NAME = 'terra-nova-cache-v4-final';
const urlsToCache = [
  '/Project-Terra-Nova/',
  '/Project-Terra-Nova/index.html',
  '/Project-Terra-Nova/style.css',
  '/Project-Terra-Nova/game.js',
  '/Project-Terra-Nova/register-sw.js',
  '/Project-Terra-Nova/globe.png',
  '/Project-Terra-Nova/click-sound.mp3',
  '/Project-Terra-Nova/buy-sound.mp3',
  '/Project-Terra-Nova/manifest.json'
];

self.addEventListener('install', e => e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))
));

self.addEventListener('fetch', e => e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
));

// Limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});