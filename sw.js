// 好好運動：離線存檔
// 網頁先試網路（拿到新版），4 秒沒回來或沒網路就用存著的；圖示和字型存著的優先。
// YouTube、Google 登入和雲端硬碟一律直接上網，不經過這裡。
// 改了圖示或 manifest 時，把 VER 加一，手機才會換成新的。
const VER = 'v1';
const APP = 'hm-app-' + VER, FONT = 'hm-font';
const CORE = [
  './', 'index.html', 'manifest.webmanifest',
  'icons/icon-32.png', 'icons/icon-48.png', 'icons/icon-96.png', 'icons/icon-144.png',
  'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(APP);
    await Promise.all(CORE.map(u => fetch(u, { cache: 'no-cache' }).then(r => { if (r.ok) return c.put(u, r); }).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('hm-app-') && k !== APP) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin === location.origin) {
    if (u.pathname.endsWith('/sw.js')) return;
    if (r.mode === 'navigate') e.respondWith(page(r, u));
    else e.respondWith(asset(r));
  } else if (u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com') e.respondWith(font(r, u));
});

async function page(r, u) {
  const c = await caches.open(APP), key = u.origin + u.pathname;
  const net = fetch(r).then(res => { if (res.ok) c.put(key, res.clone()); return res; });
  try {
    return await Promise.race([net, new Promise((_, no) => setTimeout(no, 4000))]);
  } catch (err) {
    const x = (await c.match(key)) || (await c.match('./')) || (await c.match('index.html'));
    if (x) return x;
    return net.catch(() => new Response('<meta charset="utf-8"><p style="font:16px sans-serif;padding:24px">現在沒有網路，這一頁還沒存起來。</p>', { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
  }
}

async function asset(r) {
  const c = await caches.open(APP), hit = await c.match(r.url);
  if (hit) return hit;
  try {
    const res = await fetch(r);
    if (res.ok && res.status === 200) c.put(r.url, res.clone());
    return res;
  } catch (err) {
    return (await c.match(r.url, { ignoreSearch: true })) || Response.error();
  }
}

async function font(r, u) {
  const c = await caches.open(FONT), hit = await c.match(r);
  if (hit && u.hostname === 'fonts.gstatic.com') return hit;
  const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; });
  if (hit) { net.catch(() => {}); return hit; }
  try { return await net; } catch (err) { return new Response('', { status: 503 }); }
}
