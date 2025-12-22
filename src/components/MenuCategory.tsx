/**
 * Componente MenuCategory
 * Seção de categoria com lista de items e modal de detalhes
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MenuItem } from './MenuItem';
import { MenuItemModal } from './MenuItemModal';
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
 * Gerencia estado do modal de detalhes
 */
export const MenuCategory: React.FC<MenuCategoryProps> = ({
  category,
  categoryTitle,
  items,
  className,
}) => {
  const [selectedItem, setSelectedItem] = useState<MenuItemType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: MenuItemType) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay para animação de saída
    setTimeout(() => setSelectedItem(null), 300);
  };

  if (items.length === 0) return null;

  return (
    <>
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
          <p className="mt-4 text-primary-600 text-sm">
            Clique em um prato para ver mais detalhes
          </p>
        </div>

        {/* Grid de items - 3 colunas em desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {items.map((item, index) => (
            <MenuItem
              key={item.id}
              item={item}
              index={index}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      </motion.section>

      {/* Modal de detalhes */}
      <MenuItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
