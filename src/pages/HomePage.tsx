/**
 * Página Home - Página principal do site
 * Composição de todos os componentes
 * 
 * Boas práticas aplicadas:
 * - Component composition pattern
 * - Importação organizada
 * - Estrutura clara e legível
 */

import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { InfoList } from '../components/InfoList';

/**
 * HomePage - Página principal
 * Compõe todos os componentes principais do site
 */
export const HomePage: React.FC = () => {
  return (
    <main>
      {/* Hero Section - Seção principal com título */}
      <HeroSection />

      {/* Info Section - Informações sobre reservas */}
      <InfoList />

      {/* Seção adicional: Mapa ou galeria (futuro) */}
      <section className="section-container bg-white">
        <div className="text-center">
          <h2 className="heading-secondary text-primary-900 mb-4">
            Venha nos Visitar
          </h2>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto mb-8">
            Estamos localizados no coração de São Paulo, na República
          </p>
          
          {/* Placeholder para mapa ou conteúdo adicional */}
          <div className="max-w-4xl mx-auto bg-primary-100 rounded-lg p-12 border-2 border-dashed border-primary-300">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-primary-400"
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
            <p className="text-primary-600 font-medium">
              Integração com mapa (Google Maps ou similar)
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};



