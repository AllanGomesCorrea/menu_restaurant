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
import { Link } from 'react-router-dom';
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
        'overflow-hidden',
        className
      )}
    >
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

        {/* Título principal com animação */}
        <motion.h1
          variants={itemVariants}
          className="heading-primary text-white mb-4 md:mb-6 drop-shadow-lg"
        >
          NÃO FEZ RESERVA?
        </motion.h1>

        {/* Subtítulo com animação */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8 drop-shadow-md"
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/reservas" className="btn-secondary">
              Fazer Reserva
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

