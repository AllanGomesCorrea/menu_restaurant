/**
 * Página de Reservas
 * Formulário completo para fazer reservas online
 * Integrado com API do backend
 */

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useBookingForm } from '../hooks/useBookingForm';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { NameField } from '../components/booking/NameField';
import { EmailField } from '../components/booking/EmailField';
import { PhoneField } from '../components/booking/PhoneField';
import { DatePicker } from '../components/booking/DatePicker';
import { EnvironmentSelector } from '../components/booking/EnvironmentSelector';
import { GuestSelector } from '../components/booking/GuestSelector';
import { TimeSlotSelector } from '../components/booking/TimeSlotSelector';
import { ObservationsField } from '../components/booking/ObservationsField';
import { ConfirmationModal } from '../components/booking/ConfirmationModal';

/**
 * Página de reservas completa
 * Integra todos os componentes do formulário
 */
export const BookingPage: React.FC = () => {
  useScrollToTop();
  const navigate = useNavigate();

  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    isLoadingSlots,
    availableTimeSlots,
    setName,
    setEmail,
    setPhone,
    setDate,
    setEnvironment,
    setGuests,
    setTimeSlot,
    setObservations,
    incrementGuests,
    decrementGuests,
    validateForm,
    handleSubmit,
    resetForm,
  } = useBookingForm();

  // Scroll suave para erros
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(`field-${firstErrorField}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errors]);

  // Handler de nova reserva
  const handleNewBooking = () => {
    resetForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler de fechar modal
  const handleCloseModal = () => {
    navigate('/');
  };

  // Calcula progresso do formulário (0-100%)
  const calculateProgress = (): number => {
    let completed = 0;
    const total = 5;

    if (formData.date) completed++;
    if (formData.environment) completed++;
    if (formData.guests >= 1) completed++;
    if (formData.timeSlot) completed++;
    // Observações é opcional, mas conta se preenchido
    if (formData.observations || completed === 4) completed++;

    return Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50"
    >
      {/* Hero Section com imagem de fundo */}
      <section className="relative overflow-hidden text-white py-12 md:py-16">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <img src="/reserva.jpg" alt="Reservas" className="w-full h-full object-cover" />
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />
        </div>
        <div className="relative z-10 section-container">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="heading-primary mb-4 drop-shadow-lg">Faça sua Reserva</h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
              Reserve sua mesa e garanta uma experiência inesquecível na melhor cozinha caipira de
              São Paulo
            </p>
          </motion.div>

          {/* Barra de progresso */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/80 drop-shadow">Progresso</span>
              <span className="text-sm font-medium text-white/80 drop-shadow">{progress}%</span>
            </div>
            <div className="h-3 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
              <motion.div
                className="h-full bg-accent-400"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Formulário */}
      <section className="section-container py-12">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (validateForm()) {
                handleSubmit();
              }
            }}
            className="space-y-8"
          >
            {/* Dados Pessoais */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-lg border-2 border-primary-200"
            >
              <h2 className="text-xl font-display font-bold text-primary-900 mb-6 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Seus Dados
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Campo Nome */}
                <NameField value={formData.name} onChange={setName} error={errors.name} />

                {/* Campo Email */}
                <EmailField value={formData.email} onChange={setEmail} error={errors.email} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Campo Telefone */}
                <PhoneField value={formData.phone} onChange={setPhone} error={errors.phone} />
              </div>
            </motion.div>

            {/* 1. Seleção de Data */}
            <motion.div
              id="field-date"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DatePicker
                selectedDate={formData.date}
                onDateSelect={setDate}
                error={errors.date}
              />
            </motion.div>

            {/* 2. Escolha do Ambiente (ANTES do horário) */}
            <motion.div
              id="field-environment"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <EnvironmentSelector
                selectedEnvironment={formData.environment}
                onEnvironmentSelect={setEnvironment}
                error={errors.environment}
              />
            </motion.div>

            {/* 3. Horário (DEPOIS do ambiente - depende dele) */}
            <motion.div
              id="field-timeSlot"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TimeSlotSelector
                timeSlots={availableTimeSlots}
                selectedTimeSlot={formData.timeSlot}
                onTimeSlotSelect={setTimeSlot}
                error={errors.timeSlot}
                isLoading={isLoadingSlots}
              />
            </motion.div>

            {/* 4. Número de Pessoas */}
            <motion.div
              id="field-guests"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GuestSelector
                guests={formData.guests}
                onIncrement={incrementGuests}
                onDecrement={decrementGuests}
                error={errors.guests}
              />
            </motion.div>

            {/* 5. Observações */}
            <motion.div
              id="field-observations"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ObservationsField
                value={formData.observations}
                onChange={setObservations}
                error={errors.observations}
              />
            </motion.div>

            {/* Botão de Submissão */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-6"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-8 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-display font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : undefined}
                whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processando Reserva...
                  </span>
                ) : (
                  'Confirmar Reserva'
                )}
              </motion.button>

              {/* Informações de segurança */}
              <p className="text-center text-sm text-primary-600 mt-4">
                Seus dados estão seguros. Ao confirmar, você concorda com nossas políticas de
                reserva.
              </p>
            </motion.div>
          </form>

          {/* Informações de Contato */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-6 bg-white rounded-xl border-2 border-primary-200 shadow-md"
          >
            <h3 className="text-lg font-semibold text-primary-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Precisa de ajuda?
            </h3>
            <p className="text-primary-700 mb-2">
              Entre em contato conosco para reservas de grupos maiores ou eventos especiais:
            </p>
            <div className="space-y-1 text-sm text-primary-600">
              <p>
                <strong>Telefone:</strong> (11) 3258-2578
              </p>
              <p>
                <strong>Email:</strong> eventos@acasadoporco.com.br
              </p>
              <p>
                <strong>Endereço:</strong> R. Araújo, 124 - República, São Paulo - SP
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={isSuccess}
        bookingData={formData}
        onClose={handleCloseModal}
        onNewBooking={handleNewBooking}
      />
    </motion.div>
  );
};
