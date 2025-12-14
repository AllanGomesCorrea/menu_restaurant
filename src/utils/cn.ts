/**
 * Utility para combinar classes CSS com Tailwind
 * Permite merge inteligente de classes com override
 */

// Função simples para combinar classNames (similar ao clsx)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}



