const CACHE = 'ucp-v34';
const CORE = ['/', '/index.html', '/style.css', '/assets/logo.jpg', '/assets/icon-192.png', '/manifest.webmanifest', '/about.html', '/manifesto.html', '/join.html'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(CORE); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') { return; }
  e.respondWith(
    fetch(req).then(function(res){
      var copy = res.clone();
      caches.open(CACHE).then(function(c){ c.put(req, copy); }).catch(function(){});
      return res;
    }).catch(function(){ return caches.match(req).then(function(r){ return r || caches.match('/index.html'); }); })
  );
});