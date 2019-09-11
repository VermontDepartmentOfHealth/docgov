var CACHE_NAME = 'doc-gov-cache-v3';

var urlsToCache = [
  '/index.html',
  '/404.html',
  '/offline.html'
];

self.addEventListener('install', function(event) {
  console.log('install event fired', event)
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// intercept all network traffic
// cache first strategy
// live requests will cache subsequent content
self.addEventListener('fetch', function(event) {
    event.respondWith(
      // try cache first
      caches.match(event.request).then(function(response) {
        // if we get a cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(function(response) {
            // Check if we received a valid response
            if (event.request.method !== "GET" || /http:\/\/localhost:\d+\/browser-sync/i.test(event.request.url) ||
                !response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            console.log(`caching ${event.request.url}`)

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
            });

            return response;
          });
        }).catch(function() {
          // If both fail, show a generic fallback:
          return caches.match('/offline.html');
        })
      );
  });


// when we install a new SW, clear out any previous caches
self.addEventListener('activate', function(event) {

    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });