/**
 * Página HomeAnimated - Página principal com animações
 * Versão animada usando Framer Motion
 * 
 * Boas práticas aplicadas:
 * - Page transitions
 * - Scroll-triggered animations
 * - Performance-optimized animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HeroSectionAnimated } from '../components/HeroSectionAnimated';
import { InfoListAnimated } from '../components/InfoListAnimated';
import { LocationMap } from '../components/LocationMap';

// Variants para a página
const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * HomePage Animada - Página principal com animações Framer Motion
 */
export const HomePageAnimated: React.FC = () => {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hero Section Animada */}
      <HeroSectionAnimated />

      {/* Info Section Animada */}
      <InfoListAnimated />

      {/* Seção de Localização com Mapa */}
      <motion.section
        className="section-container bg-gradient-to-br from-primary-50 to-accent-50"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-center mb-12">
          <motion.h2
            className="heading-secondary text-primary-900 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            📍 Venha nos Visitar
          </motion.h2>
          <motion.p
            className="text-lg text-primary-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Estamos localizados no coração de São Paulo, no bairro da República
          </motion.p>
        </div>

        {/* Componente de Mapa do Google Maps */}
        <LocationMap address="R. Araújo, 124 - República, São Paulo - SP" />
      </motion.section>
    </motion.main>
  );
};

