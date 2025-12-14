/**
 * Componente Header - Layout
 * Navigation bar responsiva com menu mobile
 * 
 * Boas práticas aplicadas:
 * - Mobile-first approach
 * - Custom hook para gerenciar estado do menu
 * - Acessibilidade (aria-labels, roles)
 * - Animações suaves
 */

import React, { useEffect } from 'react';
import { useToggle } from '../../hooks/useToggle';
import { navLinks } from '../../data/content';
import { cn } from '../../utils/cn';

export const Header: React.FC = () => {
  const [isMenuOpen, toggleMenu, setMenuOpen] = useToggle(false);

  // Fecha o menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, setMenuOpen]);

  // Previne scroll quando menu está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-primary-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo / Título */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-2xl md:text-3xl font-display font-bold text-primary-800 hover:text-primary-900 transition-colors"
            >
              A Casa do Porco
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'px-4 py-2 rounded-lg text-base font-medium',
                  'text-primary-700 hover:text-primary-900',
                  'hover:bg-primary-50',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500'
                )}
              >
                {link.label}
                {link.external && (
                  <svg
                    className="inline-block ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                )}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className={cn(
                'inline-flex items-center justify-center p-2 rounded-lg',
                'text-primary-700 hover:text-primary-900 hover:bg-primary-50',
                'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500',
                'transition-colors duration-200'
              )}
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {/* Ícone hamburger com animação */}
              <div className="w-6 h-6 relative">
                <span
                  className={cn(
                    'absolute block h-0.5 w-6 bg-current transform transition-all duration-300',
                    isMenuOpen ? 'rotate-45 top-3' : 'rotate-0 top-1'
                  )}
                />
                <span
                  className={cn(
                    'absolute block h-0.5 w-6 bg-current top-3 transition-all duration-300',
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  )}
                />
                <span
                  className={cn(
                    'absolute block h-0.5 w-6 bg-current transform transition-all duration-300',
                    isMenuOpen ? '-rotate-45 top-3' : 'rotate-0 top-5'
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-menu"
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="px-2 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={cn(
                  'block px-4 py-3 rounded-lg text-base font-medium',
                  'text-primary-700 hover:text-primary-900',
                  'hover:bg-primary-50',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500'
                )}
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex items-center justify-between">
                  {link.label}
                  {link.external && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  )}
                </span>
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Overlay para menu mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden -z-10"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

