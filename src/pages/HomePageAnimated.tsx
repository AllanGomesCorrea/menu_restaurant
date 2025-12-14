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

      {/* Seção adicional: Mapa ou galeria */}
      <motion.section
        className="section-container bg-white"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-center">
          <motion.h2
            className="heading-secondary text-primary-900 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Venha nos Visitar
          </motion.h2>
          <motion.p
            className="text-lg text-primary-700 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Estamos localizados no coração de São Paulo, na República
          </motion.p>

          {/* Placeholder para mapa ou conteúdo adicional */}
          <motion.div
            className="max-w-4xl mx-auto bg-primary-100 rounded-lg p-12 border-2 border-dashed border-primary-300"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.svg
              className="w-16 h-16 mx-auto mb-4 text-primary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </motion.svg>
            <p className="text-primary-600 font-medium">
              Integração com mapa (Google Maps ou similar)
            </p>
          </motion.div>
        </div>
      </motion.section>
    </motion.main>
  );
};

