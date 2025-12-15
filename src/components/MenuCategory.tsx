/**
 * Componente MenuCategory
 * Seção de categoria com lista de items
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MenuItem } from './MenuItem';
import type { MenuItem as MenuItemType, MenuCategory as CategoryType } from '../types';
import { cn } from '../utils/cn';

interface MenuCategoryProps {
  category: CategoryType;
  categoryTitle: string;
  items: MenuItemType[];
  className?: string;
}

/**
 * Seção de categoria do menu
 * Agrupa e exibe todos os items de uma categoria
 */
export const MenuCategory: React.FC<MenuCategoryProps> = ({
  category,
  categoryTitle,
  items,
  className,
}) => {
  if (items.length === 0) return null;

  return (
    <motion.section
      id={category}
      className={cn('section-container scroll-mt-20', className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      {/* Título da categoria */}
      <div className="text-center mb-12">
        <motion.h2
          className="heading-secondary text-primary-900 mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {categoryTitle}
        </motion.h2>
        <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full" />
      </div>

      {/* Grid de items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {items.map((item, index) => (
          <MenuItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </motion.section>
  );
};

