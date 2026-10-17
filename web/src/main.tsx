import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initPwaListeners } from './lib/pwa';
import { ErrorBoundary } from './components/ErrorBoundary';

// Manejador automático de Vite para despliegues con nuevos chunks (cache mismatch)
window.addEventListener('vite:preloadError', (event) => {
  console.warn('[Vite] Error al precargar módulo dinámico (posible nuevo despliegue):', event);
  const lastReload = sessionStorage.getItem('vite_preload_reload');
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
    sessionStorage.setItem('vite_preload_reload', String(now));
    window.location.reload();
  }
});

// Inicializar listeners de instalación PWA
initPwaListeners();

// Registro de Service Worker para capacidades offline y PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registrado con éxito:', registration.scope);
      })
      .catch((error) => {
        console.warn('[PWA] No se pudo registrar el Service Worker:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallbackTitle="Error crítico al iniciar Personal Tools">
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
