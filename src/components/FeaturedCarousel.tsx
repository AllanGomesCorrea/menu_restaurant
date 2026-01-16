/**
 * Componente FeaturedCarousel
 * Carrossel estilo Apple TV+ para pratos em destaque
 * Auto-play com transições suaves e controles de navegação
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeaturedMenu } from '../hooks/useMenu';
import { MenuItemModal } from './MenuItemModal';
import { formatPrice } from '../data/menuData';
import type { MenuItem } from '../types';
import { cn } from '../utils/cn';

/**
 * Carrossel de pratos em destaque
 * Estilo cinematográfico inspirado no Apple TV+
 */
export const FeaturedCarousel: React.FC = () => {
  const { items: featuredItems, isLoading, error } = useFeaturedMenu();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-play
  useEffect(() => {
    if (!isPlaying || featuredItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 5000); // Troca a cada 5 segundos

    return () => clearInterval(interval);
  }, [isPlaying, featuredItems.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    // Retoma auto-play após 10 segundos
    setTimeout(() => setIsPlaying(true), 10000);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  }, [featuredItems.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 10000);
  }, [featuredItems.length]);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setIsPlaying(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedItem(null);
      setIsPlaying(true);
    }, 300);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="relative h-[500px] md:h-[600px] bg-primary-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || featuredItems.length === 0) {
    return null;
  }

  const currentItem = featuredItems[currentIndex];
  const imageUrl = currentItem?.image || '/logo.png';
  const isLogo = !currentItem?.image;

  return (
    <>
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-primary-900">
        {/* Background Image com Ken Burns effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {isLogo ? (
              <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Casa do Porco"
                  className="w-64 h-64 object-contain opacity-30"
                />
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={currentItem.name}
                className="w-full h-full object-cover"
              />
            )}
            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Conteúdo */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-20 px-6 md:px-12 lg:px-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              {/* Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  ⭐ Destaque
                </span>
                <span className="text-white/70 text-sm">
                  {currentItem.category}
                </span>
              </div>

              {/* Nome do prato */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
                {currentItem.name}
              </h2>

              {/* Descrição curta */}
              <p className="text-lg md:text-xl text-white/80 mb-6 line-clamp-2">
                {currentItem.description}
              </p>

              {/* Preço e CTA */}
              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-bold text-accent-400">
                  {formatPrice(currentItem.price)}
                </span>
                <button
                  onClick={() => handleItemClick(currentItem)}
                  className="bg-white text-primary-900 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver detalhes
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navegação por dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {featuredItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'bg-white/40 hover:bg-white/60'
                )}
                aria-label={`Ir para prato ${index + 1}`}
              />
            ))}
          </div>

          {/* Botões prev/next */}
          <button
            onClick={goToPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
            aria-label="Prato anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
            aria-label="Próximo prato"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Indicador de auto-play */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
              aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Progress bar do auto-play */}
          {isPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <motion.div
                key={currentIndex}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-full bg-accent-500"
              />
            </div>
          )}
        </div>

        {/* Mini previews dos outros pratos */}
        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3">
          {featuredItems.map((item, index) => {
            if (index === currentIndex) return null;
            const itemImage = item.image || '/logo.png';
            const itemIsLogo = !item.image;
            
            return (
              <button
                key={item.id}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300',
                  'hover:scale-110 hover:border-white',
                  'border-white/30'
                )}
              >
                {itemIsLogo ? (
                  <div className="w-full h-full bg-primary-800 flex items-center justify-center">
                    <img src="/logo.png" alt="" className="w-8 h-8 object-contain opacity-50" />
                  </div>
                ) : (
                  <img
                    src={itemImage}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Modal de detalhes */}
      <MenuItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

