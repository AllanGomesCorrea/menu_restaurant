/**
 * Componente GuestSelector
 * Seletor de número de pessoas (1-6)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { MIN_GUESTS, MAX_GUESTS, getGuestsDescription } from '../../data/bookingData';

interface GuestSelectorProps {
  guests: number;
  onIncrement: () => void;
  onDecrement: () => void;
  error?: string;
  className?: string;
}

/**
 * Seletor de número de pessoas com botões +/-
 * Limitado de 1 a 6 pessoas por mesa
 */
export const GuestSelector: React.FC<GuestSelectorProps> = ({
  guests,
  onIncrement,
  onDecrement,
  error,
  className,
}) => {
  const canDecrement = guests > MIN_GUESTS;
  const canIncrement = guests < MAX_GUESTS;

  return (
    <div className={className}>
      {/* Label */}
      <label className="block text-sm font-medium text-primary-900 mb-2">
        Número de Pessoas
      </label>

      {/* Container principal */}
      <div
        className={cn(
          'bg-white rounded-xl border-2 p-6',
          error ? 'border-red-500' : 'border-primary-200'
        )}
      >
        {/* Display do número */}
        <div className="text-center mb-6">
          <motion.div
            key={guests}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-bold text-primary-900 mb-2"
          >
            {guests}
          </motion.div>
          <p className="text-lg text-primary-700 font-medium">
            {guests === 1 ? 'pessoa' : 'pessoas'}
          </p>
          <p className="text-sm text-primary-500 mt-1">{getGuestsDescription(guests)}</p>
        </div>

        {/* Botões de controle */}
        <div className="flex items-center justify-center gap-4">
          {/* Botão de decrementar */}
          <motion.button
            type="button"
            onClick={onDecrement}
            disabled={!canDecrement}
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center',
              'border-2 transition-all duration-200',
              'focus:outline-none focus:ring-4 focus:ring-primary-300',
              canDecrement
                ? 'border-primary-600 bg-white hover:bg-primary-50 text-primary-700'
                : 'border-primary-200 bg-primary-50 text-primary-300 cursor-not-allowed'
            )}
            whileHover={canDecrement ? { scale: 1.1 } : undefined}
            whileTap={canDecrement ? { scale: 0.9 } : undefined}
            aria-label="Diminuir número de pessoas"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
            </svg>
          </motion.button>

          {/* Indicador visual de range */}
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map(num => (
              <motion.div
                key={num}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  num <= guests ? 'bg-primary-600 scale-125' : 'bg-primary-200'
                )}
                initial={{ scale: 0 }}
                animate={{ scale: num <= guests ? 1.25 : 1 }}
              />
            ))}
          </div>

          {/* Botão de incrementar */}
          <motion.button
            type="button"
            onClick={onIncrement}
            disabled={!canIncrement}
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center',
              'border-2 transition-all duration-200',
              'focus:outline-none focus:ring-4 focus:ring-primary-300',
              canIncrement
                ? 'border-primary-600 bg-white hover:bg-primary-50 text-primary-700'
                : 'border-primary-200 bg-primary-50 text-primary-300 cursor-not-allowed'
            )}
            whileHover={canIncrement ? { scale: 1.1 } : undefined}
            whileTap={canIncrement ? { scale: 0.9 } : undefined}
            aria-label="Aumentar número de pessoas"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </motion.button>
        </div>

        {/* Informação adicional */}
        <div className="mt-6 text-center">
          <p className="text-xs text-primary-600">
            Capacidade máxima: {MAX_GUESTS} pessoas por mesa
          </p>
        </div>
      </div>

      {/* Mensagem de erro */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

