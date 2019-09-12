// update in register-service-worker.js
var CACHE_NAME = 'doc-gov-cache-v4';

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
        return cache.addAll(urlsToCache);
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


// intercept all network traffic
// cache first strategy
// live requests will cache subsequent content
self.addEventListener('fetch', function(evt) {

  // respond with cache + network fallback
  evt.respondWith(fromCache(evt));

  // always go hit network and update cache
  evt.waitUntil(update(evt).then(refresh));
  
});


function fromCache(evt) {

  // return promise to open cache
  return caches.open(CACHE_NAME).then(function (cache) {

    // when the cache is open, check request
    return cache.match(evt.request).then(function(response) {

      // if we get a cache hit - return response
      if (response) { return response;}

      // otherwise, fallback to network (we'll update later)
      return fetch(evt.request).then(function(response) {
        return response;
      });

    }).catch(function() {
      // If both fail (we're probably offline), show a generic fallback:
      return caches.match('/offline.html');
    })
  });
}


function update(evt) {
  var request = evt.request.clone()

  var shouldUpdate = request.method === "GET" && 
                    !/http:\/\/localhost:\d+\/browser-sync/i.test(request.url)
  if (!shouldUpdate) { return; }


  // go get live page hit
  return fetch(request).then(function (response) {

    // clone response so we don't modify original
    var responseToCache = response.clone(); 

    var shouldCache = response &&
                      response.status === 200 &&
                      response.type === 'basic';    

    if (!shouldCache) { return responseToCache }

    // return promise to open cache
    return caches.open(CACHE_NAME).then(function (cache) {
      return cache.put(request, responseToCache).then(function () {
        return response;
      });
    });

  });
}

function refresh(response) {
  // if we didn't get anything, head back
  if (!response) return;
  
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {

 
      var message = {
        type: 'refresh',
        url: response.url,

 
        eTag: response.headers.get('ETag')
      };

 
      client.postMessage(JSON.stringify(message));
    });
  });
}