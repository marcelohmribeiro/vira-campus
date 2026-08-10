const CACHE_NAME = 'viracampus-offline-v1'
const CORE_FILES = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

async function cacheAppShell() {
  const cache = await caches.open(CACHE_NAME)
  const response = await fetch('/')
  const html = await response.clone().text()
  const assets = [...html.matchAll(/["'](\/assets\/[^"']+)["']/g)]
    .map((match) => match[1])

  await cache.put('/', response)
  await cache.addAll([...CORE_FILES, ...assets])
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      await cache.put('/', response.clone())
    }

    return response
  } catch {
    const cachedResponse = await caches.match('/')

    return cachedResponse || new Response('Aplicação indisponível offline.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) return cachedResponse

  const response = await fetch(request)

  if (response.ok || response.type === 'opaque') {
    const cache = await caches.open(CACHE_NAME)
    await cache.put(request, response.clone())
  }

  return response
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      ))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  const isLocalAsset =
    url.origin === self.location.origin &&
    ['font', 'image', 'manifest', 'script', 'style'].includes(request.destination)
  const isCloudinaryImage =
    url.hostname === 'res.cloudinary.com' && request.destination === 'image'

  if (isLocalAsset || isCloudinaryImage) {
    event.respondWith(cacheFirst(request))
  }
})
