// update in service-worker.js
var CACHE = 'doc-gov-cache-v4';


if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
        });
    });
}


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.onmessage = function (evt) {
    
    var message = JSON.parse(evt.data);
    var isRefresh = message.type === 'refresh';
    var isAsset = message.url.includes('asset');
    var lastETag = localStorage.currentETag;

    // [ETag](https://en.wikipedia.org/wiki/HTTP_ETag) header usually contains
    // the hash of the resource so it is a very effective way of check for fresh
    // content.
    var isNew =  lastETag !== message.eTag;

    if (isRefresh && isAsset && isNew) {
      // Escape the first time (when there is no ETag yet)
      if (lastETag) {
        // Inform the user about the update
        notice.hidden = false;
      }
      // For teaching purposes, although this information is in the offline
      // cache and it could be retrieved from the service worker, keeping track
      // of the header in the `localStorage` keeps the implementation simple.
      localStorage.currentETag = message.eTag;
    }
  };

}