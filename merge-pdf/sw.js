const CACHE_NAME = "pdfboon-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/offline.html",
  "/images/logo.png"
];

/* Install */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

/* Activate */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* Fetch */
self.addEventListener("fetch", (event) => {

  // Sirf GET requests handle kare
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(async () => {

        // Agar page request hai to offline page dikhao
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }

        // Baaki files cache se do
        const cached = await caches.match(event.request);
        return cached || Response.error();

      })
  );

});
