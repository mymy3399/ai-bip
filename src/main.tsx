import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/sarabun/400.css'
import '@fontsource/sarabun/500.css'
import '@fontsource/sarabun/600.css'
import '@fontsource/sarabun/700.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/shell.css'
import './styles/home.css'
import './styles/field-check-base.css'
import './styles/field-results.css'
import './styles/field-detail.css'
import './styles/legal.css'
import './styles/assistants.css'
import './styles/flow.css'
import './styles/surveillance.css'
import './styles/responsive-polish.css'
import { App } from './app/App'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // PWA enhancement is optional; the app remains fully usable without it.
    })
  })
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('AI-BIP root element was not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
