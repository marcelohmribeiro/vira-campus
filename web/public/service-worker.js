const CACHE_PREFIX = 'viracampus-offline-'
const CACHE_NAME = `${CACHE_PREFIX}v3` // versão nova: mudou a lógica de cache
const IMAGE_CACHE_PREFIX = 'viracampus-images-'
const IMAGE_CACHE_NAME = `${IMAGE_CACHE_PREFIX}v1`
const API_CACHE_PREFIX = 'viracampus-api-'
const API_CACHE_NAME = `${API_CACHE_PREFIX}v1`
const CURRENT_CACHES = [CACHE_NAME, IMAGE_CACHE_NAME, API_CACHE_NAME]

const MAX_CACHED_IMAGES = 100
const MAX_CACHED_API_RESPONSES = 60

// O Service Worker não tem acesso a import.meta.env em runtime — por isso
// a origem da API precisa estar fixa aqui, não vem de variável de ambiente.
const API_ORIGINS = [
  'https://vira-campus-efgr.vercel.app',
]

const CORE_FILES = [
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

// ---------------------------------------------------------------------------
// ESTRATÉGIA 1 — App Shell (HTML): Network First com fallback em cache
// ---------------------------------------------------------------------------
// O HTML/JS/CSS deve estar sempre atualizado quando online, mas se a rede
// cair, o app ainda precisa abrir — mesmo que com a última versão salva.

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
			await putInCache(CACHE_NAME, '/', response.clone())
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

// ---------------------------------------------------------------------------
// ESTRATÉGIA 2 — Dados da API (GET /anuncios, /categorias): Network First
// com fallback em cache — É AQUI que o requisito do desafio é atendido.
// ---------------------------------------------------------------------------
// Tenta buscar dado fresco da rede primeiro. Se conseguir, atualiza o cache
// silenciosamente. Se a rede falhar (offline), devolve a última resposta
// boa que já foi cacheada — ou seja, o que o usuário já viu antes de perder
// conexão continua visível. Se nunca carregou aquela rota antes, devolve um
// JSON de erro estruturado (não um erro de rede genérico), para o front
// conseguir tratar isso de forma previsível.

async function networkFirstApi(request) {
	try {
		const response = await fetch(request)

		// Só cacheia respostas de sucesso — erro 4xx/5xx não deve "grudar" no cache.
		if (response.ok) {
			await putInCache(API_CACHE_NAME, request, response.clone(), MAX_CACHED_API_RESPONSES)
		}

		return response
	} catch {
		const cache = await caches.open(API_CACHE_NAME)
		const cachedResponse = await cache.match(request)

		if (cachedResponse) return cachedResponse

		return new Response(
			JSON.stringify({ error: 'Sem conexão e sem dados salvos localmente para esta consulta.' }),
			{
				status: 503,
				headers: { 'Content-Type': 'application/json; charset=utf-8' },
			},
		)
	}
}

// ---------------------------------------------------------------------------
// ESTRATÉGIA 3 — Assets estáticos e imagens: Cache First
// ---------------------------------------------------------------------------
// JS/CSS/fontes com hash no nome (Vite) e fotos de anúncio no Cloudinary não
// mudam depois de publicados — busca primeiro no cache, só vai à rede se não
// tiver. Isso garante velocidade e uso offline de imagens já vistas.

async function putInCache(cacheName, request, response, maxEntries) {
	try {
		const cache = await caches.open(cacheName)
		await cache.put(request, response)

		if (maxEntries) {
			const keys = await cache.keys()
			const excessEntries = keys.length - maxEntries

			if (excessEntries > 0) {
				await Promise.all(
					keys.slice(0, excessEntries).map((key) => cache.delete(key)),
				)
			}
		}
	} catch {
		// Uma falha de quota não deve invalidar uma resposta obtida pela rede.
	}
}

async function cacheFirst(request, cacheName = CACHE_NAME, maxEntries) {
	let cachedResponse

	try {
		const cache = await caches.open(cacheName)
		cachedResponse = await cache.match(request)
	} catch {
		// Continua pela rede quando o armazenamento local está indisponível.
	}

	if (cachedResponse) return cachedResponse

	const response = await fetch(request)

	if (response.ok || response.type === 'opaque') {
		await putInCache(cacheName, request, response.clone(), maxEntries)
	}

	return response
}

// ---------------------------------------------------------------------------
// Ciclo de vida do Service Worker
// ---------------------------------------------------------------------------

self.addEventListener('install', (event) => {
	event.waitUntil(cacheAppShell().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys()
			.then((names) => Promise.all(
				names
					.filter((name) =>
						(name.startsWith(CACHE_PREFIX) || name.startsWith(IMAGE_CACHE_PREFIX) || name.startsWith(API_CACHE_PREFIX)) &&
						!CURRENT_CACHES.includes(name),
					)
					.map((name) => caches.delete(name)),
			))
			.then(() => self.clients.claim()),
	)
})

// ---------------------------------------------------------------------------
// Roteamento — decide qual estratégia aplicar a cada requisição
// ---------------------------------------------------------------------------

function isApiRequest(url) {
	return API_ORIGINS.some((origin) => url.href.startsWith(origin))
}

self.addEventListener('fetch', (event) => {
	const { request } = event
	if (request.method !== 'GET') return // nunca cacheia POST/PUT/DELETE

	const url = new URL(request.url)

	if (request.mode === 'navigate') {
		event.respondWith(networkFirst(request))
		return
	}

	if (isApiRequest(url)) {
		event.respondWith(networkFirstApi(request))
		return
	}

	const isLocalAsset =
		url.origin === self.location.origin &&
		['font', 'image', 'manifest', 'script', 'style'].includes(request.destination)
	const isCloudinaryImage =
		url.hostname === 'res.cloudinary.com' && request.destination === 'image'

	if (isLocalAsset || isCloudinaryImage) {
		event.respondWith(
			isCloudinaryImage
				? cacheFirst(request, IMAGE_CACHE_NAME, MAX_CACHED_IMAGES)
				: cacheFirst(request),
		)
	}
})