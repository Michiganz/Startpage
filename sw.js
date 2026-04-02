/* ============================================================
   Pyramid Browser — Service Worker
   Gère le cache hors-ligne : HTML, images, logos
   Note: Les CDN (Tailwind, Font Awesome, Google Fonts) nécessitent une connexion
   ============================================================ */

const CACHE_NAME = 'pyramid-v4-cdn';

/* Ressources mises en cache immédiatement à l'installation */
const PRECACHE_ASSETS = [
    './index.html',
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
    './assets/logo/Primatures.png',
    './assets/logo/minfi cm.png',
    './assets/logo/minedub.png',
    './assets/logo/minsante.png',
    './assets/logo/douanes.png',
    './assets/logo/logo-dgt-dgi.png',
    './assets/logo/icon-pyramid-play-white.svg',
    './assets/logo/Icon-PyramidMail.svg',
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
                    /* Mettre en cache si réponse valide (uniquement ressources locales) */
                    if (response && response.status === 200) {
                        const isLocalResource =
                            url.origin === self.location.origin ||
                            url.pathname.includes('.woff2') ||
                            url.pathname.includes('.css') ||
                            url.pathname.includes('index.html') ||
                            url.pathname.includes('assets/');

                        if (isLocalResource) {
                            const clone = response.clone();
                            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                        }
                    }
                    return response;
                })
                .catch(() => {
                    /* Fallback ultime pour le HTML */
                    if (event.request.headers.get('accept')?.includes('text/html')) {
                        return caches.match('./index.html');
                    }
                    return new Response('Ressource non disponible hors-ligne', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
        })
    );
});
