/**
 * Componente MenuItem
 * Exibe um item individual do cardápio com foto
 * Clicável para abrir modal com detalhes
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import type { MenuItem as MenuItemType } from '../types';
import { formatPrice } from '../data/menuData';

interface MenuItemProps {
  item: MenuItemType;
  index?: number;
  onClick?: () => void;
}

/**
 * Item individual do cardápio
 * Card com foto, nome e preço
 * Clique abre modal com detalhes completos
 */
export const MenuItem: React.FC<MenuItemProps> = ({ item, index = 0, onClick }) => {
  // Imagem padrão por categoria
  const getDefaultImage = (category: string) => {
    const images: Record<string, string> = {
      entradas: '/entradas.jpg',
      pratos: '/prato_principal.jpg',
      sobremesas: '/sobremesa.jpg',
      bebidas: '/bebidas.jpg',
    };
    return images[category] || '/prato_principal.jpg';
  };

  const imageUrl = item.image || getDefaultImage(item.category);

  return (
    <motion.div
      className={cn(
        'group relative bg-white rounded-xl overflow-hidden cursor-pointer',
        'border border-primary-200',
        'shadow-md hover:shadow-xl',
        'transition-all duration-300',
        item.featured && 'ring-2 ring-accent-500'
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
      }}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay no hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        
        {/* Badge de destaque */}
        {item.featured && (
          <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <span>⭐</span>
            <span>Destaque</span>
          </div>
        )}

        {/* Ícone de expandir */}
        <div className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
          <svg
            className="w-5 h-5 text-primary-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Nome e Preço */}
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-lg font-display font-bold text-primary-900 group-hover:text-primary-700 transition-colors line-clamp-2 flex-1">
            {item.name}
          </h4>
          <div className="text-xl font-bold text-accent-600 flex-shrink-0">
            {formatPrice(item.price)}
          </div>
        </div>

        {/* Descrição curta */}
        <p className="mt-2 text-sm text-primary-600 line-clamp-2">
          {item.description}
        </p>

        {/* Call to action sutil */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium text-primary-500 bg-primary-50 px-2.5 py-1 rounded-full">
            {item.category}
          </span>
          <span className="text-xs text-primary-400 group-hover:text-primary-600 transition-colors flex items-center gap-1">
            Ver detalhes
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Linha decorativa animada */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  );
};
