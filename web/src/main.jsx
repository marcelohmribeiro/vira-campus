import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { toast } from 'sonner'
import './css/index.css'
import { router } from './routes'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    registerServiceWorker()
  })
}

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js')

    // Caso já exista um SW novo esperando (ex: o usuário abriu o app
    // bem depois de um deploy, enquanto o app estava fechado)
    if (registration.waiting) {
      notifyUpdateAvailable(registration.waiting)
    }

    // Detecta quando um SW novo é baixado DURANTE a sessão atual
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      if (!newWorker) return

      newWorker.addEventListener('statechange', () => {
        const isUpdateReady = newWorker.state === 'installed' && navigator.serviceWorker.controller
        if (isUpdateReady) {
          notifyUpdateAvailable(newWorker)
        }
      })
    })
  } catch (error) {
    console.error('Não foi possível registrar o service worker:', error)
  }
}

function notifyUpdateAvailable(worker) {
  toast('Nova versão disponível', {
    description: 'Atualize para ver as últimas mudanças.',
    action: {
      label: 'Atualizar',
      onClick: () => worker.postMessage({ type: 'SKIP_WAITING' }),
    },
    duration: Infinity,
  })
}

// Quando o novo SW assume o controle (após o postMessage acima), recarrega
// a página automaticamente para carregar os arquivos da versão nova.
let isRefreshing = false
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (isRefreshing) return
  isRefreshing = true
  window.location.reload()
})