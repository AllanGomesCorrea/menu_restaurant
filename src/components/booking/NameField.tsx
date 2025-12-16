/**
 * Componente NameField
 * Campo de input para o nome do cliente
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

/**
 * Campo de nome com validação visual
 * Exibe feedback visual de erro quando necessário
 */
export const NameField: React.FC<NameFieldProps> = ({
  value,
  onChange,
  error,
  className,
}) => {
  return (
    <div className={className}>
      <label 
        htmlFor="booking-name" 
        className="block text-sm font-medium text-primary-900 mb-2"
      >
        Nome Completo *
      </label>
      
      <motion.input
        id="booking-name"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite seu nome completo"
        className={cn(
          'w-full px-4 py-3 rounded-lg border-2',
          'text-primary-900 placeholder-primary-400',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2',
          error
            ? 'border-red-500 bg-red-50 focus:ring-red-500'
            : 'border-primary-300 bg-white hover:border-primary-500 focus:ring-primary-500'
        )}
        whileFocus={{ scale: 1.01 }}
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? 'name-error' : undefined}
      />

      {error && (
        <motion.p
          id="name-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-2 flex items-center gap-2"
          role="alert"
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

