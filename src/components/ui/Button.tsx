/**
 * Componente Button - Atomic Design
 * Botão reutilizável com variantes, tamanhos e estados
 * 
 * Boas práticas aplicadas:
 * - TypeScript para type safety
 * - Composição com props nativas do HTML
 * - Variants para diferentes estilos
 * - Acessibilidade com disabled state
 */

import React from 'react';
import type { ButtonVariant, ButtonSize } from '../../types';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  isLoading?: boolean;
}

// Mapeamento de variantes para classes Tailwind
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500 active:bg-primary-900',
  secondary: 'bg-white text-primary-900 border-2 border-primary-300 hover:bg-primary-50 focus:ring-primary-500',
  ghost: 'bg-transparent text-primary-900 hover:bg-primary-100 focus:ring-primary-500',
  link: 'bg-transparent text-primary-700 underline-offset-4 hover:underline focus:ring-0',
};

// Mapeamento de tamanhos para classes Tailwind
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

/**
 * Componente Button com suporte a variantes e tamanhos
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Clique aqui
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        // Classes base
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // Classes de variante
        variantStyles[variant],
        // Classes de tamanho
        sizeStyles[size],
        // Classes customizadas
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
          Carregando...
        </>
      ) : (
        children
      )}
    </button>
  );
};



