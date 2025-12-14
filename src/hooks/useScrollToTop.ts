/**
 * Custom Hook: useScrollToTop
 * Scroll suave para o topo da página
 * Útil para navegação e UX
 */

import { useEffect } from 'react';

export function useScrollToTop() {
  useEffect(() => {
    // Scroll suave para o topo ao montar o componente
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);
}



