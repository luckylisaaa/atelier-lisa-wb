/* ATELIER sw.js — 自我移除版 / self-unregistering kill switch
   用途：覆蓋 GitHub 上現有的 sw.js，解除「卡在舊版＋一直閃跳」。
   原理：安裝後立即清空所有快取、把自己 unregister，並讓開著的分頁重新導向到網路最新版。
   之後不再攔截任何請求，每次都直接走網路（永遠最新）。 */
self.addEventListener('install', function(e){ self.skipWaiting(); });

self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    try{
      var keys = await caches.keys();
      await Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }catch(err){}
    try{ await self.registration.unregister(); }catch(err){}
    try{
      var wins = await self.clients.matchAll({ type:'window' });
      wins.forEach(function(c){ try{ c.navigate(c.url); }catch(err){} });
    }catch(err){}
  })());
});

/* 沒有 fetch 攔截 → 所有請求一律走網路，拿到最新檔案 */
