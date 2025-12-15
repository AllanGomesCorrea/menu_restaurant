/**
 * Entry point da aplicação
 * Configuração do React 18 com StrictMode e React Router
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.optimized.tsx'

// React 18: createRoot para Concurrent Features
// BrowserRouter: Navegação SPA
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
