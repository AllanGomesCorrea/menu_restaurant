/**
 * Custom Hook: useToggle
 * Hook reutilizável para gerenciar estado booleano (toggle)
 * Útil para modals, menus, dropdowns, etc.
 */

import { useState, useCallback } from 'react';

export function useToggle(initialState = false): [boolean, () => void, (value: boolean) => void] {
  const [state, setState] = useState<boolean>(initialState);

  // useCallback memoriza a função, evitando re-renders desnecessários
  const toggle = useCallback(() => {
    setState((prevState) => !prevState);
  }, []);

  const setValue = useCallback((value: boolean) => {
    setState(value);
  }, []);

  return [state, toggle, setValue];
}



