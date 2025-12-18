/**
 * Componente EnvironmentSelector
 * Seletor de ambiente (Salão ou Ambiente Externo)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { environmentOptions } from '../../data/bookingData';
import type { BookingEnvironment } from '../../types';

interface EnvironmentSelectorProps {
  selectedEnvironment: BookingEnvironment | null;
  onEnvironmentSelect: (environment: BookingEnvironment) => void;
  error?: string;
  className?: string;
}

/**
 * Seletor de ambiente com cards visuais
 * Permite escolher entre Salão (indoor) ou Ambiente Externo (outdoor)
 */
export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  selectedEnvironment,
  onEnvironmentSelect,
  error,
  className,
}) => {
  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-sm font-medium text-primary-900 mb-2">
        Escolha o Ambiente
      </label>

      {/* Grid de opções */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {environmentOptions.map(option => {
          const isSelected = selectedEnvironment === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => onEnvironmentSelect(option.id)}
              className={cn(
                'group relative overflow-hidden rounded-xl',
                'h-[280px]', // Altura fixa
                'transition-all duration-300',
                'text-left focus:outline-none focus:ring-2 focus:ring-primary-500',
                isSelected && 'ring-4 ring-primary-500',
                error && !selectedEnvironment && 'ring-2 ring-red-300'
              )}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Imagem de fundo */}
              <div className="absolute inset-0">
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay gradiente */}
                <div className={cn(
                  'absolute inset-0 bg-gradient-to-t transition-all duration-300',
                  isSelected
                    ? 'from-primary-900/90 via-primary-800/70 to-primary-700/50'
                    : 'from-black/80 via-black/60 to-black/40 group-hover:from-black/85'
                )} />
              </div>

              {/* Conteúdo */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                {/* Checkmark quando selecionado */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                {/* Nome */}
                <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 group-hover:text-accent-300 transition-colors">
                  {option.name}
                </h3>

                {/* Descrição */}
                <p className="text-gray-200 mb-3 text-sm">
                  {option.description}
                </p>

                {/* Features */}
                <ul className="space-y-1">
                  {option.features.map((feature, index) => (
                    <li
                      key={index}
                      className="text-xs text-white/90 flex items-center gap-2"
                    >
                      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-2 flex items-center gap-2"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  );
};

