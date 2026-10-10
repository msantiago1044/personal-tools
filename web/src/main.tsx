import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initPwaListeners } from './lib/pwa';
import { ErrorBoundary } from './components/ErrorBoundary';

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
