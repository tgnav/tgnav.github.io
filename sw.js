const workboxVersion = '5.1.3';

importScripts(`https://storage.googleapis.com/workbox-cdn/releases/${workboxVersion}/workbox-sw.js`);

workbox.core.setCacheNameDetails({
    prefix: "TGNAV"
});

workbox.routing.registerRoute(
    new RegExp('.*\.html'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'html-cache' + cacheVersion,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: maxEntries,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp('^https://cdn\.jsdelivr\.net'),
    new workbox.strategies.CacheFirst({
        cacheName: 'cdn' + cacheVersion,
        fetchOptions: {
            mode: 'cors',
            credentials: 'omit',
        },
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: maxEntries,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp('^https://(?:cdn1|cdn2|cdn3|cdn4|cdn5)\.cdn-telegram\.org'),
    new workbox.strategies.CacheFirst({
        cacheName: 'avatar-cache' + cacheVersion,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: maxEntries,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp('.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)'),
    new workbox.strategies.StaleWhileRevalidate()
);
workbox.routing.registerRoute(
    new RegExp('.*\.(css|js)'),
    new workbox.strategies.StaleWhileRevalidate()
);
