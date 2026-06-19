/**
 * ELSADEQ Service Worker
 * Caches app shell + price API responses for offline access.
 */

const CACHE_VERSION = "elsadeq-v1";
const APP_SHELL = [
  "/",
  "/gold",
  "/bars",
  "/coins",
  "/calculator",
  "/converter",
  "/charts",
  "/news",
  "/faq",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
];

// Install: pre-cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        // Ignore individual failures
        console.warn("[SW] some assets failed to cache:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API + navigation, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Skip non-GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Skip cross-origin
  if (url.origin !== self.location.origin) return;

  // Skip Next.js dev internals
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  // Network-first for navigation (HTML)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return resp;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Network-first for API calls (with cache fallback)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          return resp;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for static assets (images, css, js, fonts)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((resp) => {
        if (resp.ok && resp.type === "basic") {
          const copy = resp.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return resp;
      });
    })
  );
});

// Allow page to trigger skipWaiting from client
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
