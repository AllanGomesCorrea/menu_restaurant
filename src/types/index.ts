/**
 * Tipos globais da aplicação
 * Define as interfaces e tipos TypeScript usados em toda a aplicação
 */

// Tipo para os links de navegação
export interface NavLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

// Tipo para os itens da lista de informações
export interface InfoItem {
  id: string;
  text: string;
  icon?: string;
}

// Tipo para informações de contato
export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
}

// Tipo para variantes de botões
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';

// Tipo para tamanhos de botões
export type ButtonSize = 'sm' | 'md' | 'lg';

// Props base para componentes com children
export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}



