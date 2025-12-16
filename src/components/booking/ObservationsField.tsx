/**
 * Componente ObservationsField
 * Campo de texto para observações opcionais
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { MAX_OBSERVATIONS_LENGTH, OBSERVATIONS_PLACEHOLDER } from '../../data/bookingData';

interface ObservationsFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

/**
 * Campo de observações com contador de caracteres
 * Limite de 500 caracteres
 */
export const ObservationsField: React.FC<ObservationsFieldProps> = ({
  value,
  onChange,
  error,
  className,
}) => {
  const remainingChars = MAX_OBSERVATIONS_LENGTH - value.length;
  const isNearLimit = remainingChars < 50;
  const isAtLimit = remainingChars === 0;

  return (
    <div className={className}>
      {/* Label */}
      <label htmlFor="observations" className="block text-sm font-medium text-primary-900 mb-2">
        Observações <span className="text-primary-500 font-normal">(opcional)</span>
      </label>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="observations"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={OBSERVATIONS_PLACEHOLDER}
          rows={5}
          maxLength={MAX_OBSERVATIONS_LENGTH}
          className={cn(
            'w-full px-4 py-3 rounded-lg border-2',
            'transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-2',
            'placeholder:text-primary-400',
            error
              ? 'border-red-500 bg-red-50 focus:ring-red-500'
              : 'border-primary-300 bg-white hover:border-primary-400 focus:border-primary-500 focus:ring-primary-500'
          )}
        />

        {/* Contador de caracteres */}
        <motion.div
          className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-primary-200 shadow-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span
            className={cn(
              'text-xs font-medium',
              isAtLimit && 'text-red-600',
              isNearLimit && !isAtLimit && 'text-amber-600',
              !isNearLimit && 'text-primary-600'
            )}
          >
            {value.length} / {MAX_OBSERVATIONS_LENGTH}
          </span>
        </motion.div>
      </div>

      {/* Dicas */}
      {!error && value.length === 0 && (
        <div className="mt-2 space-y-1">
          <p className="text-xs text-primary-600 flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Informe restrições alimentares, alergias, ocasiões especiais ou preferências de mesa
            </span>
          </p>
        </div>
      )}

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

      {/* Exemplos (quando campo está vazio) */}
      {!error && value.length === 0 && (
        <div className="mt-3 p-3 bg-primary-50 rounded-lg">
          <p className="text-xs font-medium text-primary-700 mb-2">Exemplos:</p>
          <ul className="space-y-1 text-xs text-primary-600">
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              <span>"Aniversário de 30 anos, gostaria de uma mesa mais reservada"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              <span>"Alergia a frutos do mar e amendoim"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              <span>"Preferência por mesa próxima à janela"</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

