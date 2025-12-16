/**
 * Componente TimeSlotSelector
 * Seletor de horário disponível - Design moderno e minimalista
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import type { TimeSlot } from '../../types';

interface TimeSlotSelectorProps {
  timeSlots: TimeSlot[];
  selectedTimeSlot: string | null;
  onTimeSlotSelect: (timeSlotId: string) => void;
  error?: string;
  className?: string;
}

/**
 * Seletor de horário com grid de cards interativos
 * Design limpo sem categorias, apenas horários disponíveis
 */
export const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({
  timeSlots,
  selectedTimeSlot,
  onTimeSlotSelect,
  error,
  className,
}) => {

  if (timeSlots.length === 0) {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-primary-900 mb-2">
          Horário da Reserva
        </label>
        <div className="bg-primary-50 rounded-xl p-8 text-center border-2 border-dashed border-primary-300">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-primary-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-primary-600 font-medium">Selecione uma data primeiro</p>
          <p className="text-sm text-primary-500 mt-1">
            Os horários disponíveis aparecerão aqui
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Header com informação */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-primary-900">
          Escolha seu horário
        </label>
        <span className="text-xs text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
          {timeSlots.filter(s => s.available).length} disponíveis
        </span>
      </div>

      {/* Grid de horários - Design moderno sem categorias */}
      <div
        className={cn(
          'bg-gradient-to-br from-white to-primary-50/30 rounded-2xl p-6 shadow-sm',
          'border-2 transition-all duration-300',
          error ? 'border-red-300 shadow-red-100' : 'border-primary-100'
        )}
      >
        {/* Grid responsivo de horários */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {timeSlots.map((slot, index) => {
            const isSelected = selectedTimeSlot === slot.id;
            const isAvailable = slot.available;

            return (
              <motion.button
                key={slot.id}
                type="button"
                onClick={() => isAvailable && onTimeSlotSelect(slot.id)}
                disabled={!isAvailable}
                className={cn(
                  'relative group',
                  'h-14 rounded-xl font-semibold text-sm',
                  'transition-all duration-300',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  // Estilo selecionado
                  isSelected && [
                    'bg-gradient-to-br from-primary-600 to-primary-700',
                    'text-white shadow-lg shadow-primary-300',
                    'scale-105 z-10',
                  ],
                  // Estilo disponível (não selecionado)
                  !isSelected && isAvailable && [
                    'bg-white border-2 border-primary-200',
                    'text-primary-700',
                    'hover:border-primary-400 hover:shadow-md hover:scale-105',
                    'hover:bg-gradient-to-br hover:from-white hover:to-primary-50',
                  ],
                  // Estilo indisponível
                  !isAvailable && [
                    'bg-gray-50 border-2 border-gray-200',
                    'text-gray-400',
                    'cursor-not-allowed opacity-50',
                  ]
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.02,
                  duration: 0.2,
                  type: 'spring',
                  stiffness: 300,
                }}
                whileHover={
                  isAvailable
                    ? {
                        y: -2,
                      }
                    : undefined
                }
                whileTap={
                  isAvailable
                    ? {
                        scale: 0.95,
                      }
                    : undefined
                }
              >
                {/* Efeito de brilho no hover */}
                {isAvailable && !isSelected && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-400/0 to-accent-400/0 group-hover:from-primary-400/10 group-hover:to-accent-400/10 transition-all duration-300" />
                )}

                {/* Ícone de check para selecionado */}
                {isSelected && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, delay: 0.1 }}
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}

                {/* Horário */}
                <span className="relative z-10">{slot.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Dica visual - aparece apenas se nenhum horário selecionado */}
        {!selectedTimeSlot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-primary-600 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Clique no horário desejado para sua reserva
            </p>
          </motion.div>
        )}
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

