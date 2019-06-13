let version = 1.8;

let cacheName = "MyCacheV" + version

let filesToCache = [
  "/",
  "/index.html",
  "js/main.js",
];

self.addEventListener("install", function(event) {
  console.log('installing service worker')
  event.waitUntil(caches.open(cacheName).then((cache) =>{
    return cache.addAll(filesToCache);
  }))
  console.log("service worker installed...")
})

self.addEventListener('fetch', function(event) {
  console.log('fetch event', event.request.url)
  event.respondWith(
    caches.match(event.request).then(function(response) {
      (response && console.log('response from cache', event.request.url))
      return response || fetch(event.request);
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log('service worker: Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('service worker: Removing old cache', key);
          return caches.delete(key);
        }
      }))
    })
  )
  return self.clients.claim()
});
