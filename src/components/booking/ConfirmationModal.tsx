/**
 * Componente ConfirmationModal
 * Modal de confirmação de reserva com animação de sucesso
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import type { BookingFormData } from '../../types';
import {
  formatDateDisplay,
  getDayOfWeekName,
  environmentOptions,
} from '../../data/bookingData';

interface ConfirmationModalProps {
  isOpen: boolean;
  bookingData: BookingFormData;
  onClose: () => void;
  onNewBooking: () => void;
}

/**
 * Modal de confirmação exibido após submissão bem-sucedida
 * Mostra resumo da reserva com animação de checkmark
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  bookingData,
  onClose,
  onNewBooking,
}) => {
  // Busca informações do ambiente selecionado
  const environmentInfo = environmentOptions.find(env => env.id === bookingData.environment);

  // Busca o horário selecionado (formato simplificado)
  const selectedTime = bookingData.timeSlot?.replace('slot-', '').replace(/(\d{2})(\d{2})/, '$1:$2');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header com animação de sucesso */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center">
                {/* Checkmark animado */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center"
                >
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: 'easeInOut' }}
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-display font-bold text-white mb-2"
                >
                  Reserva Confirmada!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-green-50"
                >
                  Aguardamos você no dia marcado
                </motion.p>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                {/* Resumo da reserva */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">
                    Detalhes da Reserva
                  </h3>

                  {/* Data */}
                  {bookingData.date && (
                    <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-600">Data</p>
                        <p className="text-base font-semibold text-primary-900">
                          {formatDateDisplay(bookingData.date)}
                        </p>
                        <p className="text-sm text-primary-600 capitalize">
                          {getDayOfWeekName(bookingData.date)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Horário */}
                  {selectedTime && (
                    <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-600">Horário</p>
                        <p className="text-base font-semibold text-primary-900">{selectedTime}</p>
                      </div>
                    </div>
                  )}

                  {/* Ambiente */}
                  {environmentInfo && (
                    <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-2xl">
                        {environmentInfo.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary-600">Ambiente</p>
                        <p className="text-base font-semibold text-primary-900">{environmentInfo.name}</p>
                      </div>
                    </div>
                  )}

                  {/* Pessoas */}
                  <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-600">Número de Pessoas</p>
                      <p className="text-base font-semibold text-primary-900">
                        {bookingData.guests} {bookingData.guests === 1 ? 'pessoa' : 'pessoas'}
                      </p>
                    </div>
                  </div>

                  {/* Observações (se houver) */}
                  {bookingData.observations && (
                    <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary-600 mb-1">Observações</p>
                        <p className="text-sm text-primary-700">{bookingData.observations}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Informação adicional */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-amber-900 mb-1">Lembre-se</p>
                      <p className="text-sm text-amber-700">
                        Chegue com 10 minutos de antecedência. Em caso de imprevistos, entre em contato conosco pelo telefone (11) 3258-2578.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={onNewBooking}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Nova Reserva
                  </motion.button>
                  <motion.button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-white text-primary-700 rounded-lg font-medium border-2 border-primary-300 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Fechar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

