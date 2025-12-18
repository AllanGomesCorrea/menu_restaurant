/**
 * Página de Cardápio - Versão Animada
 * Menu completo com categorias e pratos
 */

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MenuCard } from '../components/MenuCard';
import { MenuCategory } from '../components/MenuCategory';
import { FeaturedDishes } from '../components/FeaturedDishes';
import { categories, getItemsByCategory } from '../data/menuData';
import { useScrollToTop } from '../hooks/useScrollToTop';

/**
 * Página de Cardápio Animada
 * Exibe todo o menu organizado por categorias
 */
export const MenuPageAnimated: React.FC = () => {
  useScrollToTop();

  // Refs para scroll suave
  const entradasRef = useRef<HTMLDivElement>(null);
  const pratosRef = useRef<HTMLDivElement>(null);
  const sobremesasRef = useRef<HTMLDivElement>(null);
  const bebidasRef = useRef<HTMLDivElement>(null);

  // Scroll suave para seção
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            Clique em uma categoria para ver os pratos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          {categories.map((category, index) => {
            const items = getItemsByCategory(category.id);
            const ref = 
              category.id === 'entradas' ? entradasRef :
              category.id === 'pratos' ? pratosRef :
              category.id === 'sobremesas' ? sobremesasRef :
              bebidasRef;

            return (
              <motion.div
                key={category.id}
                className="h-full" // Garante que o motion.div ocupe toda a altura disponível
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <MenuCard
                  category={category}
                  itemCount={items.length}
                  onClick={() => scrollToSection(ref)}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Pratos em Destaque */}
      <FeaturedDishes />

      {/* Categorias Completas */}
      <div ref={entradasRef}>
        <MenuCategory
          category="entradas"
          categoryTitle="Entradas"
          items={getItemsByCategory('entradas')}
          className="bg-amber-50/50"
        />
      </div>

      <div ref={pratosRef}>
        <MenuCategory
          category="pratos"
          categoryTitle="Pratos Principais"
          items={getItemsByCategory('pratos')}
          className="bg-white"
        />
      </div>

      <div ref={sobremesasRef}>
        <MenuCategory
          category="sobremesas"
          categoryTitle="Sobremesas"
          items={getItemsByCategory('sobremesas')}
          className="bg-purple-50/50"
        />
      </div>

      <div ref={bebidasRef}>
        <MenuCategory
          category="bebidas"
          categoryTitle="Bebidas"
          items={getItemsByCategory('bebidas')}
          className="bg-blue-50/50"
        />
      </div>

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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/reservas" 
                className="btn bg-accent-500 text-white hover:bg-accent-600"
              >
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

