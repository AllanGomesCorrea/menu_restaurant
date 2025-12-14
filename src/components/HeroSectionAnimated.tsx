/**
 * Componente HeroSectionAnimated
 * Versão animada da Hero Section usando Framer Motion
 * 
 * Boas práticas aplicadas:
 * - Animações declarativas com Framer Motion
 * - Variants para reutilização
 * - staggerChildren para animações escalonadas
 * - useInView para trigger de animações
 */

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '../utils/cn';

interface HeroSectionAnimatedProps {
  className?: string;
}

// Variants para animações reutilizáveis
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number], // easeOutCubic
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 15,
    },
  },
};

/**
 * Hero Section Animada - Seção principal do site com animações
 */
export const HeroSectionAnimated: React.FC<HeroSectionAnimatedProps> = ({ className }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={cn(
        'relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center',
        'bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200',
        'overflow-hidden',
        className
      )}
    >
      {/* Background pattern decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
      </div>

      <div className="relative z-10 section-container text-center">
        {/* Logo ou ícone decorativo com animação */}
        <motion.div
          variants={iconVariants}
          className="mb-6 md:mb-8 flex justify-center"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-700 flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        </motion.div>

        {/* Título principal com animação */}
        <motion.h1
          variants={itemVariants}
          className="heading-primary text-primary-900 mb-4 md:mb-6"
        >
          NÃO FEZ RESERVA?
        </motion.h1>

        {/* Subtítulo com animação */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl lg:text-2xl text-primary-700 max-w-3xl mx-auto mb-8"
        >
          Veja como garantir sua mesa em um dos melhores restaurantes de São Paulo
        </motion.p>

        {/* CTA com animação */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="#informacoes"
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver Informações
          </motion.a>
          <motion.a
            href="#reservas"
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Fazer Reserva
          </motion.a>
        </motion.div>
      </div>

      {/* Decoração: ondas na parte inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 md:h-16 text-white"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,0 L0,60 Q300,120 600,60 T1200,60 L1200,0 Z"
            fill="currentColor"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        </svg>
      </div>
    </motion.section>
  );
};

