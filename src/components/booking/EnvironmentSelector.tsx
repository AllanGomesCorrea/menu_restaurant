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
                'relative overflow-hidden rounded-xl p-6',
                'border-2 transition-all duration-300',
                'text-left focus:outline-none focus:ring-2 focus:ring-primary-500',
                isSelected
                  ? 'border-primary-600 bg-primary-50 shadow-lg'
                  : 'border-primary-200 bg-white hover:border-primary-400 hover:shadow-md',
                error && !selectedEnvironment && 'border-red-300'
              )}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Checkmark quando selecionado */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Ícone */}
              <div className="text-4xl mb-3">{option.icon}</div>

              {/* Nome */}
              <h3
                className={cn(
                  'text-lg font-display font-bold mb-2',
                  isSelected ? 'text-primary-900' : 'text-primary-800'
                )}
              >
                {option.name}
              </h3>

              {/* Descrição */}
              <p
                className={cn(
                  'text-sm mb-3',
                  isSelected ? 'text-primary-700' : 'text-primary-600'
                )}
              >
                {option.description}
              </p>

              {/* Features */}
              <ul className="space-y-1">
                {option.features.map((feature, index) => (
                  <li
                    key={index}
                    className={cn(
                      'text-xs flex items-center gap-2',
                      isSelected ? 'text-primary-600' : 'text-primary-500'
                    )}
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

