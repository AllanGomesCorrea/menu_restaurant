/**
 * Componente InfoListAnimated
 * Lista de informações animada com Framer Motion
 * 
 * Boas práticas aplicadas:
 * - Animações escalonadas (stagger)
 * - useInView para trigger quando visível
 * - Animações suaves e profissionais
 */

import React from 'react';
import { motion, useInView } from 'framer-motion';
import { reservationInfo } from '../data/content';
import { cn } from '../utils/cn';
import type { InfoItem } from '../types';

interface InfoListAnimatedProps {
  items?: InfoItem[];
  className?: string;
}

// Variants para animações
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

/**
 * InfoListItem Animado - Item individual da lista
 */
const InfoListItemAnimated: React.FC<{
  text: string;
  index: number;
}> = ({ text, index }) => {
  return (
    <motion.li
      variants={itemVariants}
      className={cn(
        'flex items-start gap-4 p-4 md:p-6',
        'bg-white rounded-lg shadow-md',
        'border border-primary-100'
      )}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        transition: { duration: 0.2 },
      }}
    >
      {/* Ícone/Número do item */}
      <motion.div
        className="flex-shrink-0"
        initial={{ rotate: -180, scale: 0 }}
        whileInView={{ rotate: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          type: 'spring' as const,
          stiffness: 200,
          damping: 15,
          delay: index * 0.1,
        }}
      >
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-sm md:text-base">
          {index + 1}
        </div>
      </motion.div>

      {/* Texto do item */}
      <div className="flex-1 pt-1">
        <p className="text-base md:text-lg text-primary-900 leading-relaxed">
          {text}
        </p>
      </div>

      {/* Ícone decorativo */}
      <motion.div
        className="flex-shrink-0 hidden sm:block"
        initial={{ x: -10, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.3 }}
      >
        <svg
          className="w-5 h-5 text-primary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.div>
    </motion.li>
  );
};

/**
 * InfoListAnimated - Lista de informações com animações
 */
export const InfoListAnimated: React.FC<InfoListAnimatedProps> = ({
  items = reservationInfo,
  className,
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      id="informacoes"
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={cn('section-container bg-primary-50', className)}
    >
      {/* Cabeçalho da seção */}
      <motion.div variants={headingVariants} className="text-center mb-12">
        <h2 className="heading-secondary text-primary-900 mb-4">
          Informações Importantes
        </h2>
        <p className="text-lg text-primary-700 max-w-2xl mx-auto">
          Confira as dicas para garantir sua mesa sem complicações
        </p>
      </motion.div>

      {/* Lista de informações */}
      <motion.ul
        variants={containerVariants}
        className="space-y-4 md:space-y-6 max-w-4xl mx-auto"
        aria-label="Lista de informações sobre reservas"
      >
        {items.map((item, index) => (
          <InfoListItemAnimated key={item.id} text={item.text} index={index} />
        ))}
      </motion.ul>

      {/* Nota adicional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-12 text-center"
      >
        <p className="text-sm md:text-base text-primary-600 italic">
          💡 Dica: Para melhor experiência, recomendamos chegar nos horários menos movimentados
        </p>
      </motion.div>
    </motion.section>
  );
};

