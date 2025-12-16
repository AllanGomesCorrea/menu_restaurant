/**
 * Componente PhoneField
 * Campo de input para telefone com máscara automática (DDD) + Número
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface PhoneFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

/**
 * Aplica máscara de telefone brasileiro
 * Formato: (11) 98765-4321 ou (11) 3456-7890
 */
const applyPhoneMask = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara conforme o tamanho
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  } else {
    // Celular com 9 dígitos
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

/**
 * Remove a máscara e retorna apenas os números
 */
export const removePhoneMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Campo de telefone com máscara automática
 * Valida formato brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const PhoneField: React.FC<PhoneFieldProps> = ({
  value,
  onChange,
  error,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = applyPhoneMask(e.target.value);
    onChange(maskedValue);
  };

  return (
    <div className={className}>
      <label 
        htmlFor="booking-phone" 
        className="block text-sm font-medium text-primary-900 mb-2"
      >
        Telefone com DDD *
      </label>
      
      <motion.input
        id="booking-phone"
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="(11) 99999-9999"
        maxLength={15} // (XX) XXXXX-XXXX
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
        aria-describedby={error ? 'phone-error' : undefined}
      />

      {/* Dica de formato */}
      {!error && !value && (
        <p className="text-xs text-primary-500 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Digite o DDD + número (celular ou fixo)
        </p>
      )}

      {error && (
        <motion.p
          id="phone-error"
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

