(function(){
  const CACHE_NAME='kyushu-cruise-offline-v6';
  const REMOTE_ASSETS=[
    'https://www.msccruises.com/int/-/media/global-contents/ships/fleet/bellissima/public-areas/be_galleria_bellissima.jpg?as=1&bc=transparent&hash=94D485D919A7F9E7DCF0BAB8500EF5D4&mh=600&mw=960',
    'https://www.msccruises.com/int/-/media/global-contents/ships/fleet/bellissima/public-areas/london-theatre_be.jpg?as=1&bc=transparent&hash=53CEEEFD17906DF4C79193B097BAE810&mh=600&mw=960',
    'https://www.msccruises.com/int/-/media/global-contents/ships/fleet/bellissima/public-areas/atmosphere-pool.jpg?as=1&bc=transparent&hash=E29BB7AC01F8ADF4CD3F04EF455BDC11&mh=600&mw=960',
    'https://www.msccruises.com/int/-/media/global-contents/ships/fleet/grandiosa/public-area/family-entertainment.jpg?as=1&bc=transparent&hash=C08109EE6E53E1FFF0BDFE48F0DBC180&mh=600&mw=960',
    'https://www.msccruises.com/int/-/media/global-contents/ships/fleet/bellissima/restaurants/lighthouse-restaurant.jpg?as=1&bc=transparent&hash=0B20D58758195B1A8EECB8C6E1734CB3&mh=1080&mw=1380',
    'https://www.msccruises.com/int/-/media/global-contents/ships/fleet/bellissima/restaurants/be_restaurant_and_bar_market_place_05.jpg?as=1&bc=transparent&hash=8AE185271A6CC520989ACAA6B4591BED&mh=1080&mw=1380',
    'https://www.msccruises.com/int/-/media/global-contents/ships/fleet/bellissima/bars-lounges/carousel-lounge_be.jpg?as=1&bc=transparent&hash=F1083F88422BE3455FEEAEAAF4386919&mh=1080&mw=1380',
    'https://www.msccruises.com/int/-/media/global-contents/ships/fleet/bellissima/bars-lounges/sky-lounge.jpg?as=1&bc=transparent&hash=A369D6DC24FB4A7BA73ABA36F34D3000&mh=1080&mw=1380',
    'https://www.msccruises.com/int/-/media/global-contents/ships/fleet/bellissima/bars-lounges/jean-philippe-chocolat-cafe.jpg?as=1&bc=transparent&hash=1643E02C05B07226D54313DBC0231387&mh=1080&mw=1380',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap'
  ];
  const localAssets=['./','./index.html','./guide/index.html','./guide/before-trip.html','./guide/embarkation.html','./guide/japan-disembark.html','./guide/return-home.html','./offline.js','./service-worker.js','./ship/index.html','./ship/day1.html','./ship/day2.html','./ship/day5.html','./ship/day6.html','./ship/free.html','./ship/family.html','./ship/paid.html','./ship/food.html','./ship/night.html','./ship/seaday.html','./ship/floors.html'];

  if('serviceWorker' in navigator){ navigator.serviceWorker.register('/service-worker.js').catch(()=>navigator.serviceWorker.register('./service-worker.js')).catch(()=>{}); }

  function addButton(){
    if(document.getElementById('offline-download-btn')) return;
    const b=document.createElement('button');
    b.id='offline-download-btn';
    b.textContent='⬇ 下載離線版';
    b.style.cssText='position:fixed;right:14px;bottom:14px;z-index:9999;border:0;border-radius:999px;padding:12px 16px;background:#063b66;color:#fff;font-weight:900;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer;font-family:inherit';
    b.onclick=downloadOffline;
    document.body.appendChild(b);
  }

  async function downloadOffline(){
    const b=document.getElementById('offline-download-btn');
    b.disabled=true; b.textContent='準備離線資料…';
    try{
      if('serviceWorker' in navigator) await navigator.serviceWorker.ready;
      const cache=await caches.open(CACHE_NAME);
      let done=0; const all=localAssets.concat(REMOTE_ASSETS);
      for(const url of all){
        try{
          const req=url.startsWith('http')?new Request(url,{mode:'no-cors',cache:'reload'}):new Request(url,{cache:'reload'});
          const res=await fetch(req);
          await cache.put(req,res.clone());
        }catch(e){}
        done++; b.textContent=`下載離線版 ${done}/${all.length}`;
      }
      localStorage.setItem('cruiseOfflineReady',new Date().toISOString());
      b.textContent='✓ 已可離線使用';
      alert('離線資料已準備完成。請在登船前切換飛航模式測試一次。地圖、導航與即時天氣仍需要網路。');
    }catch(e){
      b.disabled=false; b.textContent='重試下載離線版';
      alert('離線下載未完成，請確認網路後再試一次。');
    }
  }
  window.addEventListener('DOMContentLoaded',()=>{
    addButton();
    if(localStorage.getItem('cruiseOfflineReady')) document.getElementById('offline-download-btn').textContent='✓ 已下載離線版';
  });
})();
