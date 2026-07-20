/* ============================================================
   Pyramid Browser — Service Worker
   Gère le cache hors-ligne : HTML, images, logos
   Note: Les CDN (Tailwind, Font Awesome, Google Fonts) nécessitent une connexion
   ============================================================ */

const CACHE_NAME = 'pyramid-v5-webp';

/* Ressources mises en cache immédiatement à l'installation */
const PRECACHE_ASSETS = [
    './index.html',
    './product_logo(1).svg',
    './assets/backgrounds/adamaoua-ruche.webp',
    './assets/backgrounds/arts-massa.webp',
    './assets/backgrounds/bimbia-plage.webp',
    './assets/backgrounds/campements-pygmes.webp',
    './assets/backgrounds/eglise-bamenda.webp',
    './assets/backgrounds/festival-massa.webp',
    './assets/backgrounds/gorges-de-kola.webp',
    './assets/backgrounds/lagon-bleu-garoua.webp',
    './assets/backgrounds/lion-garoua.webp',
    './assets/backgrounds/mont-cameroun-deido.webp',
    './assets/backgrounds/new-bell-city.webp',
    './assets/backgrounds/ngondo-piroguiers.webp',
    './assets/backgrounds/ngouon-chapeau.webp',
    './assets/backgrounds/plage-kribi.webp',
    './assets/backgrounds/pont-edea.webp',
    './assets/backgrounds/port-douala.webp',
    './assets/backgrounds/singe-garoua.webp',
    './assets/backgrounds/ville-yaounde.webp',
    './assets/logo/ANTIC.png',
    './assets/logo/Camtel.png',
    './assets/logo/cnps.jpg',
    './assets/logo/Cyberix.png',
    './assets/logo/feicom.png',
    './assets/logo/Icon-PyramidMail.svg',
    './assets/logo/icon-pyramid-play-white.svg',
    './assets/logo/maviance.png',
    './assets/logo/minfi cm.png',
    './assets/logo/Minjec.jpg',
    './assets/logo/Minpostel.jpeg',
    './assets/logo/nexah.png',
    './assets/logo/Port autonome Kribi.png',
    './assets/logo/Primatures.png',
    './assets/logo/Source du Pays.png',
    './assets/logo/tara.png',
];

/* ── Installation ─────────────────────────────────────────── */
self.addEventListener('install', event => {
    console.log('[SW] Installation...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            /* Ajouts individuels tolérants : une 404 ne casse pas tout le précache */
            Promise.allSettled(PRECACHE_ASSETS.map(asset => cache.add(asset)))
                .then(results => {
                    const failed = results
                        .map((r, i) => r.status === 'rejected' ? PRECACHE_ASSETS[i] : null)
                        .filter(Boolean);
                    if (failed.length) console.warn('[SW] Précache partiel, échecs:', failed);
                    else console.log('[SW] Précache terminé');
                    return self.skipWaiting();
                })
        )
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
