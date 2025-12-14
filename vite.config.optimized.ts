/**
 * Vite Config - Versão Otimizada
 * Configurações de performance e otimização
 * 
 * Otimizações aplicadas:
 * - Code splitting configurado
 * - Chunk size warnings
 * - Build optimizations
 * - Asset handling
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    // Tamanho máximo de warnings para chunks
    chunkSizeWarningLimit: 1000,
    
    // Otimização de build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs em produção
        drop_debugger: true,
      },
    },
    
    // Code splitting manual para otimizar bundles
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk: bibliotecas de terceiros
          vendor: ['react', 'react-dom'],
          
          // Framer Motion em chunk separado (grande biblioteca)
          animations: ['framer-motion'],
        },
      },
    },
    
    // Source maps apenas para debugging (pode desabilitar em produção)
    sourcemap: false,
  },
  
  // Otimizações de servidor de desenvolvimento
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: false,
  },
  
  // Preview server config
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: false,
  },
});



