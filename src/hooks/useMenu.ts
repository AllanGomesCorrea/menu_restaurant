/**
 * Hook customizado para gerenciar o cardápio
 * Busca dados da API e mantém cache local
 */

import { useState, useEffect, useCallback } from 'react';
import { menuApi, ApiError } from '../services/api';
import type { ApiMenuItem } from '../services/api';
import type { MenuItem, MenuCategory } from '../types';

// Mapeia categorias da API para categorias do frontend
const categoryMap: Record<string, MenuCategory> = {
  ENTRADAS: 'entradas',
  PRATOS: 'pratos',
  SOBREMESAS: 'sobremesas',
  BEBIDAS: 'bebidas',
};

// Converte item da API para formato do frontend
const mapApiItemToMenuItem = (item: ApiMenuItem): MenuItem => ({
  id: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  category: categoryMap[item.category] || 'entradas',
  image: item.imageUrl || undefined,
  featured: item.featured,
});

interface UseMenuReturn {
  menuItems: MenuItem[];
  menuByCategory: {
    entradas: MenuItem[];
    pratos: MenuItem[];
    sobremesas: MenuItem[];
    bebidas: MenuItem[];
  } | null;
  featuredItems: MenuItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para buscar e gerenciar o cardápio
 */
export const useMenu = (): UseMenuReturn => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuByCategory, setMenuByCategory] = useState<UseMenuReturn['menuByCategory']>(null);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenu = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Buscar menu agrupado por categoria
      const byCategoryData = await menuApi.getByCategory();

      const mappedByCategory = {
        entradas: byCategoryData.entradas.map(mapApiItemToMenuItem),
        pratos: byCategoryData.pratos.map(mapApiItemToMenuItem),
        sobremesas: byCategoryData.sobremesas.map(mapApiItemToMenuItem),
        bebidas: byCategoryData.bebidas.map(mapApiItemToMenuItem),
      };

      setMenuByCategory(mappedByCategory);

      // Combinar todos os itens
      const allItems = [
        ...mappedByCategory.entradas,
        ...mappedByCategory.pratos,
        ...mappedByCategory.sobremesas,
        ...mappedByCategory.bebidas,
      ];
      setMenuItems(allItems);

      // Filtrar itens em destaque
      const featured = allItems.filter((item) => item.featured);
      setFeaturedItems(featured);
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Erro ao carregar o cardápio. Tente novamente.';
      setError(errorMessage);
      console.error('Erro ao buscar menu:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return {
    menuItems,
    menuByCategory,
    featuredItems,
    isLoading,
    error,
    refetch: fetchMenu,
  };
};

/**
 * Hook para buscar apenas os itens em destaque
 */
export const useFeaturedMenu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await menuApi.getFeatured();
        setItems(data.map(mapApiItemToMenuItem));
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? err.message
            : 'Erro ao carregar destaques.';
        setError(errorMessage);
        console.error('Erro ao buscar destaques:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { items, isLoading, error };
};

export default useMenu;

