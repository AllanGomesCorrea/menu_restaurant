/**
 * Componente Card - Atomic Design
 * Container reutilizável para seções de conteúdo
 * 
 * Boas práticas aplicadas:
 * - Composição flexível com children
 * - Props para customização de estilos
 * - Semântica HTML com article/section
 */

import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: boolean;
  hover?: boolean;
}

// Mapeamento de padding
const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Componente Card para agrupar conteúdo relacionado
 * @example
 * <Card padding="md" shadow hover>
 *   <h3>Título</h3>
 *   <p>Conteúdo do card</p>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  children,
  className,
  as: Component = 'div',
  padding = 'md',
  shadow = true,
  hover = false,
}) => {
  return (
    <Component
      className={cn(
        // Classes base
        'rounded-lg bg-white',
        // Padding
        paddingStyles[padding],
        // Shadow
        shadow && 'shadow-md',
        // Hover effect
        hover && 'transition-all duration-200 hover:shadow-lg hover:scale-105',
        // Classes customizadas
        className
      )}
    >
      {children}
    </Component>
  );
};

/**
 * Sub-componente CardHeader
 * Header opcional do Card
 */
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

/**
 * Sub-componente CardContent
 * Conteúdo principal do Card
 */
export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn(className)}>
      {children}
    </div>
  );
};

/**
 * Sub-componente CardFooter
 * Footer opcional do Card
 */
export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('mt-4 pt-4 border-t border-primary-200', className)}>
      {children}
    </div>
  );
};



