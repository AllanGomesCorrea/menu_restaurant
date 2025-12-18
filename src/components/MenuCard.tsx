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
 * Card de categoria do menu - Design moderno com imagens
 * Exibe categoria com imagem de fundo, título, descrição e quantidade de items
 */
export const MenuCard: React.FC<MenuCardProps> = ({ category, itemCount, onClick }) => {
  return (
    <motion.div
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'h-[320px]', // Altura fixa para uniformizar
        'cursor-pointer',
        'shadow-lg hover:shadow-2xl',
        'transition-all duration-500'
      )}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Imagem de fundo */}
      <div className="absolute inset-0">
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 group-hover:from-black/95 transition-all duration-500" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        {/* Título */}
        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 group-hover:text-accent-300 transition-colors duration-300">
          {category.title}
        </h3>

        {/* Descrição */}
        <p className="text-gray-200 mb-4 text-sm md:text-base leading-relaxed">
          {category.description}
        </p>

        {/* Badge de quantidade + Seta */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <span className="text-sm font-medium text-white">{itemCount} opções</span>
          </div>

          {/* Seta indicativa */}
          <motion.div
            className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center"
            whileHover={{ scale: 1.1, x: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Borda decorativa no hover */}
      <motion.div
        className="absolute inset-0 border-2 border-accent-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={false}
      />
    </motion.div>
  );
};

