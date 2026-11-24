/* Service worker застосунку «Тести ЛБФМК Марченко»: зберігає головну сторінку для швидкого запуску; усе інше — з мережі */
var C='lbfmk-hub-v1',SHELL=['/','/index.html','/tests.json','/manifest.webmanifest','/icon-192.png','/icon-512.png','/apple-touch-icon.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(SHELL);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C;}).map(function(x){return caches.delete(x);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  var shell=SHELL.indexOf(u.pathname)>=0;
  if(!shell)return;                          // тести, підручники, тренажери — завжди свіжі з мережі
  e.respondWith(fetch(e.request).then(function(r){var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp);});return r;})
    .catch(function(){return caches.match(e.request,{ignoreSearch:true});}));
});
