/* ============================================================
   Pyramid Browser — Service Worker
   Gère le cache hors-ligne : polices, CSS, HTML, fonds d'écran
   ============================================================ */

const CACHE_NAME = 'pyramid-v3';

/* Ressources mises en cache immédiatement à l'installation */
const PRECACHE_ASSETS = [
    './new_tab.html',
    './style.css',
    './fonts/fonts.css',
    './assets/backgrounds/mountain.jpg',
    './assets/backgrounds/waterfall.jpg',
    './assets/backgrounds/landscape.jpg',
    './assets/backgrounds/starry-night.jpg',
    './assets/backgrounds/dark-forest.jpg',
    './assets/backgrounds/beach.jpg',
    './assets/backgrounds/sunrise.jpg',
    './assets/backgrounds/nature.jpg',
    './assets/backgrounds/forest.jpg',
    './assets/backgrounds/meadow.jpg',
    /* Les fichiers woff2 sont mis en cache dynamiquement */
];

/* ── Installation ─────────────────────────────────────────── */
self.addEventListener('install', event => {
    console.log('[SW] Installation...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            /* Pré-cache des assets locaux */
            return cache.addAll(PRECACHE_ASSETS)
                .then(() => {
                    console.log('[SW] Précache terminé');
                    return self.skipWaiting();
                })
                .catch(err => {
                    console.warn('[SW] Précache partiel:', err);
                    return self.skipWaiting();
                });
        })
    );
});

/* ── Activation & nettoyage des vieux caches ──────────────── */
self.addEventListener('activate', event => {
    console.log('[SW] Activation...');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('[SW] Suppression ancien cache:', key);
                        return caches.delete(key);
                    })
            )
        ).then(() => self.clients.claim())
    );
});

/* ── Stratégie fetch ──────────────────────────────────────── */
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    /* Ignorer les requêtes non-GET et les API météo */
    if (event.request.method !== 'GET') return;
    if (url.hostname === 'api.open-meteo.com') return; /* toujours live */

    /* Stratégie : Cache First → Network fallback */
    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) {
                console.log('[SW] Cache hit:', url.pathname);
                return cached;
            }
            /* Pas en cache — fetch network */
            return fetch(event.request)
                .then(response => {
                    /* Mettre en cache si réponse valide */
                    if (response && response.status === 200) {
                        const shouldCache =
                            url.hostname === 'fonts.gstatic.com' ||
                            url.pathname.includes('.woff2') ||
                            url.pathname.includes('.css') ||
                            url.pathname.includes('new_tab.html') ||
                            url.pathname.includes('assets/backgrounds');

                        if (shouldCache) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                        }
                    }
                    return response;
                })
                .catch(() => {
                    /* Fallback ultime pour le HTML */
                    if (event.request.headers.get('accept')?.includes('text/html')) {
                        return caches.match('./new_tab.html');
                    }
                    return new Response('Ressource non disponible hors-ligne', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
        })
    );
});
