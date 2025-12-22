/**
 * Componente TimeSlotSelector
 * Seletor de horário disponível - Design moderno e minimalista
 * Integrado com API para disponibilidade real
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
  isLoading?: boolean;
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
  isLoading = false,
  className,
}) => {
  // Skeleton loader
  if (isLoading) {
    return (
      <div className={className}>
        <label className="block text-sm font-medium text-primary-900 mb-2">
          Horário da Reserva
        </label>
        <div className="bg-gradient-to-br from-white to-primary-50/30 rounded-2xl p-6 shadow-sm border-2 border-primary-100">
          <div className="flex items-center justify-center gap-3 py-8">
            <svg
              className="animate-spin h-6 w-6 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-primary-600 font-medium">
              Verificando disponibilidade...
            </span>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="text-primary-600 font-medium">
            Selecione uma data e ambiente primeiro
          </p>
          <p className="text-sm text-primary-500 mt-1">
            Os horários disponíveis aparecerão aqui
          </p>
        </div>
      </div>
    );
  }

  const availableCount = timeSlots.filter((s) => s.available).length;

  return (
    <div className={className}>
      {/* Header com informação */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-primary-900">
          Escolha seu horário
        </label>
        <span
          className={cn(
            'text-xs px-3 py-1 rounded-full',
            availableCount > 0
              ? 'text-primary-600 bg-primary-50'
              : 'text-red-600 bg-red-50'
          )}
        >
          {availableCount > 0
            ? `${availableCount} disponíveis`
            : 'Nenhum disponível'}
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
        {availableCount === 0 ? (
          <div className="text-center py-6">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-600 font-medium">
              Todos os horários estão ocupados
            </p>
            <p className="text-sm text-red-500 mt-1">
              Tente selecionar outra data ou ambiente
            </p>
          </div>
        ) : (
          <>
            {/* Grid responsivo de horários - apenas disponíveis */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {timeSlots.filter(slot => slot.available).map((slot, index) => {
                const isSelected = selectedTimeSlot === slot.id;

                return (
                  <motion.button
                    key={slot.id}
                    type="button"
                    onClick={() => onTimeSlotSelect(slot.id)}
                    className={cn(
                      'relative group h-14 rounded-xl font-semibold text-sm transition-all duration-300',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                      isSelected
                        ? 'bg-gradient-to-r from-primary-700/80 via-primary-600/75 to-primary-500/70 text-white shadow-md shadow-primary-300/30 scale-[1.02] z-10 border-2 border-primary-400/60'
                        : 'bg-white border-2 border-primary-300 text-gray-900 hover:border-primary-500 hover:shadow-md hover:scale-105'
                    )}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: index * 0.02,
                      duration: 0.2,
                      type: 'spring',
                      stiffness: 300,
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Efeito de brilho no hover */}
                    {!isSelected && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-400/0 to-primary-600/0 group-hover:from-primary-400/10 group-hover:to-primary-600/10 transition-all duration-300" />
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
          </>
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
