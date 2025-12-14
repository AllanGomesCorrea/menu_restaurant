/**
 * Componente InfoListItem
 * Item individual da lista de informações
 * 
 * Boas práticas aplicadas:
 * - Componente reutilizável e tipado
 * - Props interface clara
 * - Semântica HTML adequada
 */

import React from 'react';
import { cn } from '../utils/cn';

interface InfoListItemProps {
  text: string;
  index?: number;
  className?: string;
}

/**
 * InfoListItem - Item individual da lista de informações
 * @example
 * <InfoListItem 
 *   text="Temos mesas todos os dias por ordem de chegada." 
 *   index={0}
 * />
 */
export const InfoListItem: React.FC<InfoListItemProps> = ({ 
  text, 
  index = 0,
  className 
}) => {
  return (
    <li
      className={cn(
        'flex items-start gap-4 p-4 md:p-6',
        'bg-white rounded-lg shadow-md',
        'hover:shadow-lg hover:scale-105',
        'transition-all duration-300',
        'border border-primary-100',
        className
      )}
      style={{
        // Animação escalonada para cada item
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Ícone/Número do item */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-sm md:text-base">
          {index + 1}
        </div>
      </div>

      {/* Texto do item */}
      <div className="flex-1 pt-1">
        <p className="text-base md:text-lg text-primary-900 leading-relaxed">
          {text}
        </p>
      </div>

      {/* Ícone decorativo */}
      <div className="flex-shrink-0 hidden sm:block">
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
      </div>
    </li>
  );
};



