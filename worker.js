let currentTimestamp = 'initial';
self.addEventListener('message', (event) => {
    if (event.data.application) {
        currentTimestamp = event.data.application;
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map((cacheName) => {
                if (cacheName !== currentTimestamp) {
                    return caches.delete(cacheName);
                }
            }));
        });
    }
});
self.addEventListener('fetch', (event) => {
    console.log(event.request.url);
    event.respondWith(caches.match(event.request).then((resp) => {
        return resp || fetch(event.request).then((response) => {
            let responseClone = response.clone();
            caches.open(currentTimestamp).then((cache) => {
                cache.put(event.request, responseClone);
            });
            return response;
        });
    }).catch(() => {
        return new Response('No internet');
    }));
});
