/**
 * Custom Hook: useMediaQuery
 * Hook para detectar media queries de forma reativa
 * Útil para lógica condicional baseada em breakpoints
 */

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Verifica se window.matchMedia está disponível (SSR safety)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia(query);
    
    // Atualiza o estado inicial
    setMatches(media.matches);

    // Listener para mudanças
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Adiciona listener (suporte a navegadores antigos e novos)
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      // Fallback para navegadores antigos
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}

// Helpers pré-configurados para breakpoints comuns
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');



