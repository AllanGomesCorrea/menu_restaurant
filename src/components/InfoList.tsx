/**
 * Componente InfoList
 * Lista de informações sobre reservas
 * 
 * Boas práticas aplicadas:
 * - Renderização dinâmica com .map()
 * - Props tipadas com TypeScript
 * - Separação de dados (importados de data/content.ts)
 * - Key prop adequada para performance
 */

import React from 'react';
import { InfoListItem } from './InfoListItem';
import { reservationInfo } from '../data/content';
import { cn } from '../utils/cn';
import type { InfoItem } from '../types';

interface InfoListProps {
  items?: InfoItem[];
  className?: string;
}

/**
 * InfoList - Lista de informações sobre reservas
 * Renderiza dinamicamente os itens da lista
 * 
 * @example
 * <InfoList items={reservationInfo} />
 */
export const InfoList: React.FC<InfoListProps> = ({ 
  items = reservationInfo,
  className 
}) => {
  return (
    <section 
      id="informacoes"
      className={cn('section-container bg-primary-50', className)}
    >
      {/* Cabeçalho da seção */}
      <div className="text-center mb-12">
        <h2 className="heading-secondary text-primary-900 mb-4">
          Informações Importantes
        </h2>
        <p className="text-lg text-primary-700 max-w-2xl mx-auto">
          Confira as dicas para garantir sua mesa sem complicações
        </p>
      </div>

      {/* Lista de informações */}
      <ul 
        className="space-y-4 md:space-y-6 max-w-4xl mx-auto"
        aria-label="Lista de informações sobre reservas"
      >
        {items.map((item, index) => (
          <InfoListItem
            key={item.id}
            text={item.text}
            index={index}
          />
        ))}
      </ul>

      {/* Nota adicional */}
      <div className="mt-12 text-center">
        <p className="text-sm md:text-base text-primary-600 italic">
          💡 Dica: Para melhor experiência, recomendamos chegar nos horários menos movimentados
        </p>
      </div>
    </section>
  );
};



