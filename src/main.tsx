/**
 * Entry point da aplicação
 * Configuração do React 18 com StrictMode
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.optimized.tsx'

// React 18: createRoot para Concurrent Features
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
