/**
 * Componente MenuItemModal
 * Modal elegante para exibir detalhes completos de um prato
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuItem } from '../types';
import { formatPrice } from '../data/menuData';
import { cn } from '../utils/cn';

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal de detalhes do prato
 * Exibe foto grande, nome, descrição e preço
 */
export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  if (!item) return null;

  // Usa logo como imagem padrão quando não há foto
  const imageUrl = item.image || '/logo.png';
  const isLogo = !item.image;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Imagem Hero */}
              <div className={cn(
                "relative h-64 overflow-hidden",
                isLogo && "bg-primary-100 flex items-center justify-center"
              )}>
                <img
                  src={imageUrl}
                  alt={item.name}
                  className={cn(
                    isLogo 
                      ? "w-40 h-40 object-contain" 
                      : "w-full h-full object-cover"
                  )}
                />
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badge de destaque */}
                {item.featured && (
                  <div className="absolute top-4 left-4 bg-accent-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <span>⭐</span>
                    <span>Destaque do Chef</span>
                  </div>
                )}

                {/* Botão fechar */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Preço sobreposto */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                  <span className="text-2xl font-bold text-accent-600">
                    {formatPrice(item.price)}
                  </span>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                {/* Categoria */}
                <span className="inline-block text-xs font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
                  {item.category}
                </span>

                {/* Nome do prato */}
                <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-900 mb-4">
                  {item.name}
                </h2>

                {/* Descrição */}
                <p className="text-base md:text-lg text-primary-700 leading-relaxed">
                  {item.description}
                </p>

                {/* Divider decorativo */}
                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />
                  <span className="text-primary-400">🐷</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />
                </div>

                {/* Info adicional */}
                <div className="flex items-center justify-between text-sm text-primary-600">
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Porção individual
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Feito com amor
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

