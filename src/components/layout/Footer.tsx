/**
 * Componente Footer - Layout
 * Footer com informações de contato e links sociais
 * 
 * Boas práticas aplicadas:
 * - Semântica HTML (footer, address)
 * - Acessibilidade (aria-labels)
 * - Links com ícones para melhor UX
 */

import React from 'react';
import { contactInfo } from '../../data/content';
import { cn } from '../../utils/cn';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Coluna 1: Sobre */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4">
              A Casa do Porco
            </h3>
            <p className="text-primary-200 leading-relaxed">
              Um dos melhores restaurantes de São Paulo, especializado em
              pratos com porco de alta qualidade e receitas autorais.
            </p>
          </div>

          {/* Coluna 2: Contato */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Contato</h3>
            <address className="not-italic space-y-3 text-primary-200">
              {/* Endereço */}
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 mt-1 flex-shrink-0 text-accent-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{contactInfo.address}</span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0 text-accent-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-accent-400 transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>

              {/* Telefone */}
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0 text-accent-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
                  className="hover:text-accent-400 transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
            </address>
          </div>

          {/* Coluna 3: Horários e Redes Sociais */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Horários</h3>
            <div className="space-y-2 text-primary-200 mb-6">
              <p>Segunda a Sexta: 11h - 23h</p>
              <p>Sábados e Domingos: 11h - 00h</p>
              <p>Feriados: Consulte disponibilidade</p>
            </div>

            {/* Redes Sociais */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Redes Sociais</h4>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/acasadoporco/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-10 h-10 rounded-full bg-primary-800',
                    'flex items-center justify-center',
                    'hover:bg-accent-500 hover:scale-110',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-accent-400'
                  )}
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                
                <a
                  href="https://www.facebook.com/acasadoporco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-10 h-10 rounded-full bg-primary-800',
                    'flex items-center justify-center',
                    'hover:bg-accent-500 hover:scale-110',
                    'transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-accent-400'
                  )}
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-primary-700" />

        {/* Copyright e créditos */}
        <div className="text-center text-primary-300 text-sm">
          <p className="mb-2">
            © {currentYear} A Casa do Porco. Todos os direitos reservados.
          </p>
          <p className="text-xs">
            Site desenvolvido para fins educacionais • Clone não oficial
          </p>
        </div>
      </div>
    </footer>
  );
};



