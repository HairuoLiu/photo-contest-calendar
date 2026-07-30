import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { I18nProvider } from './i18n'
import './index.css'

// PWA: register the service worker for offline use + installability.
// Production only — never cache during local dev (it breaks HMR).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Resolve the SW path from the app root, which differs on GitHub Pages.
    const base = location.hostname.endsWith('github.io')
      ? '/photo-contest-calendar/'
      : '/'
    navigator.serviceWorker.register(base + 'sw.js').catch(() => {})
  })
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
)
