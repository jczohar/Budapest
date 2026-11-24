const V='bp-guide-20261124-01',RT='bp-runtime-v1';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==RT).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
async function trim(c,n){const k=await c.keys();if(k.length>n)for(const r of k.slice(0,k.length-n))await c.delete(r)}
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put('index.html',c));return x}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put(r,c));return x})));return}
 if(/tile\.openstreetmap\.org|cartocdn\.com|upload\.wikimedia\.org/.test(u.host)){
  e.respondWith(caches.open(RT).then(async c=>{const m=await c.match(r);const f=fetch(r).then(x=>{c.put(r,x.clone());trim(c,500);return x}).catch(()=>m);return m||f}));}
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():self.clients.openWindow('./index.html')))});
