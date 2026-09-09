/* 仮払い・立替メモ — オフライン用の Service Worker
   アプリ本体を丸ごとキャッシュして、圏外の現場でも起動できるようにする。 */

const CACHE = 'karibarai-v1';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon-180.png',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE)
            .then(c => c.addAll(ASSETS))
            .then(() => self.skipWaiting())
            .catch(() => self.skipWaiting())
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

/* キャッシュ優先。裏でネットワークから取り直して次回に備える。 */
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        caches.match(e.request).then(hit => {
            const fresh = fetch(e.request).then(res => {
                if (res && res.status === 200 && res.type === 'basic') {
                    const copy = res.clone();
                    caches.open(CACHE).then(c => c.put(e.request, copy));
                }
                return res;
            }).catch(() => hit);
            return hit || fresh;
        })
    );
});
