/**
 * Página de Cardápio - Versão Animada
 * Menu completo com categorias e pratos
 * Busca dados da API
 */

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MenuCard } from '../components/MenuCard';
import { MenuCategory } from '../components/MenuCategory';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { categories } from '../data/menuData';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useMenu } from '../hooks/useMenu';

/**
 * Página de Cardápio Animada
 * Exibe todo o menu organizado por categorias
 */
export const MenuPageAnimated: React.FC = () => {
  useScrollToTop();
  const { menuByCategory, isLoading, error } = useMenu();

  // Refs para scroll suave
  const entradasRef = useRef<HTMLDivElement>(null);
  const pratosRef = useRef<HTMLDivElement>(null);
  const sobremesasRef = useRef<HTMLDivElement>(null);
  const bebidasRef = useRef<HTMLDivElement>(null);

  // Scroll suave para seção
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Helper para obter itens por categoria
  const getItemsByCategory = (categoryId: string) => {
    if (!menuByCategory) return [];
    switch (categoryId) {
      case 'entradas':
        return menuByCategory.entradas;
      case 'pratos':
        return menuByCategory.pratos;
      case 'sobremesas':
        return menuByCategory.sobremesas;
      case 'bebidas':
        return menuByCategory.bebidas;
      default:
        return [];
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hero Section */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <img
            src="/home_reserva.jpg"
            alt="A Casa do Porco"
            className="w-full h-full object-cover"
          />
          {/* Overlay gradiente para garantir legibilidade do texto */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60" />
        </div>

        <div className="relative z-10 section-container text-center">
          <motion.h1
            className="heading-primary text-white mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Nosso Cardápio
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 font-display italic drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Cozinha Caipira
          </motion.p>

          <motion.p
            className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mt-4 drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Descubra o que há de melhor na tradicional culinária brasileira
          </motion.p>
        </div>
      </section>

      {/* Mensagem de erro */}
      {error && (
        <section className="section-container bg-red-50">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <p className="text-red-500 text-sm mt-2">
              Verifique se o servidor está rodando em http://localhost:3000
            </p>
          </div>
        </section>
      )}

      {/* Grid de Categorias */}
      <section className="section-container bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-secondary text-primary-900 mb-4">
            Explore Nosso Menu
          </h2>
          <p className="text-lg text-primary-700">
            {isLoading ? 'Carregando cardápio...' : 'Clique em uma categoria para ver os pratos'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          {categories.map((category, index) => {
            const items = getItemsByCategory(category.id);
            const ref =
              category.id === 'entradas'
                ? entradasRef
                : category.id === 'pratos'
                  ? pratosRef
                  : category.id === 'sobremesas'
                    ? sobremesasRef
                    : bebidasRef;

            return (
              <motion.div
                key={category.id}
                className="h-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <MenuCard
                  category={category}
                  itemCount={isLoading ? 0 : items.length}
                  onClick={() => scrollToSection(ref)}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Carrossel de Pratos em Destaque */}
      <FeaturedCarousel />

      {/* Categorias Completas */}
      {!isLoading && menuByCategory && (
        <>
          <div ref={entradasRef}>
            <MenuCategory
              category="entradas"
              categoryTitle="Entradas"
              items={menuByCategory.entradas}
              className="bg-amber-50/50"
            />
          </div>

          <div ref={pratosRef}>
            <MenuCategory
              category="pratos"
              categoryTitle="Pratos Principais"
              items={menuByCategory.pratos}
              className="bg-white"
            />
          </div>

          <div ref={sobremesasRef}>
            <MenuCategory
              category="sobremesas"
              categoryTitle="Sobremesas"
              items={menuByCategory.sobremesas}
              className="bg-purple-50/50"
            />
          </div>

          <div ref={bebidasRef}>
            <MenuCategory
              category="bebidas"
              categoryTitle="Bebidas"
              items={menuByCategory.bebidas}
              className="bg-blue-50/50"
            />
          </div>
        </>
      )}

      {/* Skeleton loader */}
      {isLoading && (
        <section className="section-container bg-white">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto animate-pulse mb-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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
      )}

      {/* CTA Section */}
      <section className="section-container bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Pronto para experimentar?
          </h2>
          <p className="text-lg md:text-xl text-primary-200 mb-8">
            Reserve sua mesa agora e desfrute da melhor cozinha caipira de São Paulo
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/reservas" className="btn bg-accent-500 text-white hover:bg-accent-600">
                Fazer Reserva
              </Link>
            </motion.div>

            <motion.a
              href="tel:1132582578"
              className="btn bg-white text-primary-900 hover:bg-primary-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ligar Agora
            </motion.a>
          </div>
        </motion.div>
      </section>
    </motion.main>
  );
};
