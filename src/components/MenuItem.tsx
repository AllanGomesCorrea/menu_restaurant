/**
 * Componente MenuItem
 * Exibe um item individual do cardápio
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import type { MenuItem as MenuItemType } from '../types';
import { formatPrice } from '../data/menuData';

interface MenuItemProps {
  item: MenuItemType;
  index?: number;
}

/**
 * Item individual do cardápio
 * Mostra nome, descrição e preço
 */
export const MenuItem: React.FC<MenuItemProps> = ({ item, index = 0 }) => {
  return (
    <motion.div
      className={cn(
        'group relative bg-white rounded-lg p-6',
        'border border-primary-200',
        'shadow-md hover:shadow-xl',
        'transition-all duration-300',
        item.featured && 'ring-2 ring-accent-500'
      )}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Badge de destaque */}
      {item.featured && (
        <div className="absolute -top-3 -right-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          ⭐ Destaque
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Nome do prato */}
          <h4 className="text-lg md:text-xl font-display font-bold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">
            {item.name}
          </h4>

          {/* Descrição */}
          <p className="text-sm md:text-base text-primary-700 leading-relaxed mb-4">
            {item.description}
          </p>

          {/* Categoria badge (small) */}
          <span className="inline-block text-xs font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        {/* Preço */}
        <div className="flex-shrink-0 text-right">
          <div className="text-2xl md:text-3xl font-bold text-accent-600">
            {formatPrice(item.price)}
          </div>
        </div>
      </div>

      {/* Linha decorativa */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </motion.div>
  );
};

