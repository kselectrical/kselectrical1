import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)

// Unregister any active service worker and clear caches to prevent white-screen issues from stale caching of index.html
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister()
        .then(() => console.log('SW: Unregistered active service worker successfully'))
        .catch(err => console.error('SW: Unregistration failed:', err));
    }
  });
}

if ('caches' in window) {
  caches.keys().then((names) => {
    for (const name of names) {
      caches.delete(name);
    }
  });
}

// Auto-recover from dynamic import / chunk load failures (prevents blank white screen)
window.addEventListener('error', (event) => {
  if (
    event.message &&
    (event.message.includes('Loading chunk') ||
     event.message.includes('dynamically imported module') ||
     event.message.includes('Failed to fetch'))
  ) {
    console.warn('Chunk load error detected. Reloading page...');
    const hasReloaded = sessionStorage.getItem('chunk_reload_retry');
    if (!hasReloaded) {
      sessionStorage.setItem('chunk_reload_retry', 'true');
      window.location.reload();
    }
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason ? String(event.reason) : '';
  if (
    reason.includes('Loading chunk') ||
    reason.includes('dynamically imported module') ||
    reason.includes('Failed to fetch')
  ) {
    console.warn('Unhandled chunk rejection detected. Reloading page...');
    const hasReloaded = sessionStorage.getItem('chunk_reload_retry');
    if (!hasReloaded) {
      sessionStorage.setItem('chunk_reload_retry', 'true');
      window.location.reload();
    }
  }
});

