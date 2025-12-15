/**
 * Dados do Cardápio
 * Menu completo organizado por categorias
 */

import type { MenuItem, CategoryInfo } from '../types';

// Informações das categorias
export const categories: CategoryInfo[] = [
  {
    id: 'entradas',
    title: 'Entradas',
    description: 'Comece sua experiência gastronômica',
    icon: '🍽️',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'pratos',
    title: 'Pratos Principais',
    description: 'O melhor da cozinha caipira',
    icon: '🥩',
    color: 'from-red-500 to-pink-600',
  },
  {
    id: 'sobremesas',
    title: 'Sobremesas',
    description: 'Doçura para finalizar',
    icon: '🍰',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'bebidas',
    title: 'Bebidas',
    description: 'Harmonize sua refeição',
    icon: '🍷',
    color: 'from-blue-500 to-purple-600',
  },
];

// Menu completo
export const menuData: MenuItem[] = [
  // ========== ENTRADAS ==========
  {
    id: 'e1',
    name: 'Bolinho de Porco',
    description: 'Crocante por fora, suculento por dentro. Servido com molho especial da casa',
    price: 28.00,
    category: 'entradas',
    featured: true,
  },
  {
    id: 'e2',
    name: 'Torresmo',
    description: 'Tradicional torresmo mineiro crocante com farofa de bacon',
    price: 24.00,
    category: 'entradas',
    featured: false,
  },
  {
    id: 'e3',
    name: 'Linguiça Artesanal',
    description: 'Linguiça defumada da casa com purê de batata doce',
    price: 32.00,
    category: 'entradas',
    featured: false,
  },
  {
    id: 'e4',
    name: 'Pão de Queijo Recheado',
    description: 'Pão de queijo mineiro recheado com carne seca desfiada',
    price: 22.00,
    category: 'entradas',
    featured: false,
  },

  // ========== PRATOS PRINCIPAIS ==========
  {
    id: 'p1',
    name: 'Costela Assada 12 Horas',
    description: '12 horas de cozimento lento. Acompanha farofa, vinagrete e arroz',
    price: 89.00,
    category: 'pratos',
    featured: true,
  },
  {
    id: 'p2',
    name: 'Barriga de Porco Caramelizada',
    description: 'Barriga suína caramelizada com melaço, purê de mandioquinha e couve',
    price: 78.00,
    category: 'pratos',
    featured: true,
  },
  {
    id: 'p3',
    name: 'Lombo ao Molho Madeira',
    description: 'Lombo suíno grelhado ao molho madeira, batatas rústicas e legumes',
    price: 72.00,
    category: 'pratos',
    featured: false,
  },
  {
    id: 'p4',
    name: 'Pernil Confitado',
    description: 'Pernil confitado por 8 horas, farofa crocante e banana da terra',
    price: 85.00,
    category: 'pratos',
    featured: true,
  },
  {
    id: 'p5',
    name: 'Costelinha ao Molho Barbecue',
    description: 'Costelinha baby back ao molho barbecue caseiro, batata chips',
    price: 92.00,
    category: 'pratos',
    featured: false,
  },
  {
    id: 'p6',
    name: 'Feijoada Completa',
    description: 'Feijoada tradicional com todos os acompanhamentos. Serve 2 pessoas',
    price: 140.00,
    category: 'pratos',
    featured: false,
  },

  // ========== SOBREMESAS ==========
  {
    id: 's1',
    name: 'Doce de Leite com Queijo',
    description: 'Doce de leite cremoso com queijo minas artesanal',
    price: 24.00,
    category: 'sobremesas',
    featured: true,
  },
  {
    id: 's2',
    name: 'Pudim de Chocolate Belga',
    description: 'Pudim de chocolate meio amargo com calda de caramelo',
    price: 28.00,
    category: 'sobremesas',
    featured: false,
  },
  {
    id: 's3',
    name: 'Torta de Limão',
    description: 'Massa amanteigada, recheio cremoso de limão siciliano e merengue',
    price: 26.00,
    category: 'sobremesas',
    featured: false,
  },
  {
    id: 's4',
    name: 'Petit Gateau',
    description: 'Bolo quente de chocolate com sorvete de creme',
    price: 32.00,
    category: 'sobremesas',
    featured: true,
  },
  {
    id: 's5',
    name: 'Cocada Cremosa',
    description: 'Cocada tradicional cremosa com coco queimado',
    price: 20.00,
    category: 'sobremesas',
    featured: false,
  },

  // ========== BEBIDAS ==========
  {
    id: 'b1',
    name: 'Caipirinha Clássica',
    description: 'Cachaça artesanal, limão, açúcar e gelo',
    price: 18.00,
    category: 'bebidas',
    featured: true,
  },
  {
    id: 'b2',
    name: 'Caipirinha de Frutas Vermelhas',
    description: 'Morango, framboesa, amora, cachaça e açúcar',
    price: 22.00,
    category: 'bebidas',
    featured: false,
  },
  {
    id: 'b3',
    name: 'Vinho Tinto Casa Reserva',
    description: 'Taça de vinho tinto da casa selecionado',
    price: 24.00,
    category: 'bebidas',
    featured: false,
  },
  {
    id: 'b4',
    name: 'Suco Natural',
    description: 'Laranja, limão, maracujá ou abacaxi',
    price: 12.00,
    category: 'bebidas',
    featured: false,
  },
  {
    id: 'b5',
    name: 'Chopp Artesanal',
    description: 'Chopp gelado de produção própria - 300ml',
    price: 15.00,
    category: 'bebidas',
    featured: true,
  },
  {
    id: 'b6',
    name: 'Refrigerante',
    description: 'Coca-Cola, Guaraná, Sprite - 350ml',
    price: 8.00,
    category: 'bebidas',
    featured: false,
  },
];

// Helper: Buscar items por categoria
export const getItemsByCategory = (category: string): MenuItem[] => {
  return menuData.filter(item => item.category === category);
};

// Helper: Buscar items em destaque
export const getFeaturedItems = (): MenuItem[] => {
  return menuData.filter(item => item.featured === true);
};

// Helper: Formatar preço
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

