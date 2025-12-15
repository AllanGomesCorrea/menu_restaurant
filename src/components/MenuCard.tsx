/**
 * Componente MenuCard
 * Card de categoria do menu com link de navegação interna
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import type { CategoryInfo } from '../types';

interface MenuCardProps {
  category: CategoryInfo;
  itemCount: number;
  onClick?: () => void;
}

/**
 * Card de categoria do menu
 * Exibe categoria com ícone, título, descrição e quantidade de items
 */
export const MenuCard: React.FC<MenuCardProps> = ({ category, itemCount, onClick }) => {
  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-xl p-8',
        'h-full', // Altura total do container pai para uniformizar
        'bg-gradient-to-br', category.color,
        'text-white cursor-pointer',
        'shadow-lg hover:shadow-2xl',
        'transition-all duration-300'
      )}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background decorativo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Conteúdo - Flexbox para distribuir espaço */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          {/* Ícone */}
          <div className="text-6xl mb-4">{category.icon}</div>

          {/* Título */}
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">
            {category.title}
          </h3>

          {/* Descrição */}
          <p className="text-white/90 mb-4 text-sm md:text-base">
            {category.description}
          </p>
        </div>

        {/* Badge de quantidade - Sempre no final */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 self-start">
          <span className="text-sm font-medium">{itemCount} opções</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

