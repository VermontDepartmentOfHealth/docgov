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
  // return promise to open cache
return caches.open(CACHE_NAME).then(function (cache) {
    // go get live page hit every time
    return fetch(request).then(function (response) {
      // clone request so we don't modify original
      var responseToCache = response.clone(); 

      var shouldCache = request.method === "GET" && 
                        !/http:\/\/localhost:\d+\/browser-sync/i.test(request.url) &&
                        response &&
                        response.status === 200 &&
                        response.type === 'basic';

      if (shouldCache) {
        cache.put(request, responseToCache);
      }
    });
  });
}

function refresh(response) {
  // return self.clients.matchAll().then(function (clients) {
  //   clients.forEach(function (client) {

 
  //     var message = {
  //       type: 'refresh',
  //       url: response.url,

 
  //       eTag: response.headers.get('ETag')
  //     };

 
  //     client.postMessage(JSON.stringify(message));
  //   });
  // });
}