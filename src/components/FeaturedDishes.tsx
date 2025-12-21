/**
 * Componente FeaturedDishes
 * Exibe os pratos em destaque de todas as categorias
 * Busca dados da API
 */

import React from 'react';
import { motion } from 'framer-motion';
import { MenuItem } from './MenuItem';
import { useFeaturedMenu } from '../hooks/useMenu';

/**
 * Seção de pratos em destaque
 * Mostra items com featured: true
 */
export const FeaturedDishes: React.FC = () => {
  const { items: featuredItems, isLoading, error } = useFeaturedMenu();

  // Skeleton loader enquanto carrega
  if (isLoading) {
    return (
      <section className="section-container bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center mb-12">
          <h2 className="heading-secondary text-primary-900 mb-4">
            Pratos em Destaque
          </h2>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto">
            Carregando...
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Mensagem de erro
  if (error) {
    return (
      <section className="section-container bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (featuredItems.length === 0) return null;

  return (
    <section className="section-container bg-gradient-to-br from-primary-50 to-accent-50">
      {/* Título */}
      <div className="text-center mb-12">
        <motion.h2
          className="heading-secondary text-primary-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Pratos em Destaque
        </motion.h2>
        <motion.p
          className="text-lg text-primary-700 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Seleção especial dos nossos pratos mais pedidos e premiados
        </motion.p>
        <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full mt-4" />
      </div>

      {/* Grid de pratos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {featuredItems.map((item, index) => (
          <MenuItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};
