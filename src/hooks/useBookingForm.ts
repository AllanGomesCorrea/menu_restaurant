/**
 * Hook customizado para gerenciar o formulário de reservas
 * Gerencia estado, validação e submissão
 */

import { useState, useCallback, useMemo } from 'react';
import type { BookingFormData, BookingFormErrors, TimeSlot } from '../types';
import {
  isDateValid,
  getTimeSlotsForDate,
  MIN_GUESTS,
  MAX_GUESTS,
  MAX_OBSERVATIONS_LENGTH,
} from '../data/bookingData';

interface UseBookingFormReturn {
  formData: BookingFormData;
  errors: BookingFormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  availableTimeSlots: TimeSlot[];
  setDate: (date: Date | null) => void;
  setEnvironment: (environment: 'indoor' | 'outdoor') => void;
  setGuests: (guests: number) => void;
  setTimeSlot: (timeSlotId: string) => void;
  setObservations: (observations: string) => void;
  incrementGuests: () => void;
  decrementGuests: () => void;
  validateField: (field: keyof BookingFormData) => boolean;
  validateForm: () => boolean;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}

const initialFormData: BookingFormData = {
  date: null,
  environment: null,
  guests: 2, // Padrão: 2 pessoas (casal)
  timeSlot: null,
  observations: '',
};

/**
 * Hook para gerenciar o formulário de reservas
 * Inclui validação, estado e lógica de submissão
 */
export const useBookingForm = (): UseBookingFormReturn => {
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Calcula os slots de horário disponíveis baseado na data selecionada
  const availableTimeSlots = useMemo(() => {
    if (!formData.date) return [];
    return getTimeSlotsForDate(formData.date);
  }, [formData.date]);

  // ========== VALIDAÇÃO DE CAMPOS ==========

  /**
   * Valida um campo específico
   */
  const validateField = useCallback((field: keyof BookingFormData): boolean => {
    let error = '';

    switch (field) {
      case 'date':
        if (!formData.date) {
          error = 'Por favor, selecione uma data';
        } else if (!isDateValid(formData.date)) {
          error = 'A data deve ser hoje ou no futuro';
        }
        break;

      case 'environment':
        if (!formData.environment) {
          error = 'Por favor, selecione o ambiente';
        }
        break;

      case 'guests':
        if (formData.guests < MIN_GUESTS) {
          error = `Mínimo de ${MIN_GUESTS} pessoa`;
        } else if (formData.guests > MAX_GUESTS) {
          error = `Máximo de ${MAX_GUESTS} pessoas por mesa`;
        }
        break;

      case 'timeSlot':
        if (!formData.timeSlot) {
          error = 'Por favor, selecione um horário';
        }
        break;

      case 'observations':
        if (formData.observations.length > MAX_OBSERVATIONS_LENGTH) {
          error = `Máximo de ${MAX_OBSERVATIONS_LENGTH} caracteres`;
        }
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return true;
    }
  }, [formData]);

  /**
   * Valida todos os campos do formulário
   */
  const validateForm = useCallback((): boolean => {
    const dateValid = validateField('date');
    const environmentValid = validateField('environment');
    const guestsValid = validateField('guests');
    const timeSlotValid = validateField('timeSlot');
    const observationsValid = validateField('observations');

    return dateValid && environmentValid && guestsValid && timeSlotValid && observationsValid;
  }, [validateField]);

  // ========== SETTERS DE CAMPOS ==========

  const setDate = useCallback((date: Date | null) => {
    setFormData(prev => ({ ...prev, date, timeSlot: null })); // Reset timeSlot quando mudar data
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.date;
      delete newErrors.timeSlot;
      return newErrors;
    });
  }, []);

  const setEnvironment = useCallback((environment: 'indoor' | 'outdoor') => {
    setFormData(prev => ({ ...prev, environment }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.environment;
      return newErrors;
    });
  }, []);

  const setGuests = useCallback((guests: number) => {
    const clampedGuests = Math.max(MIN_GUESTS, Math.min(MAX_GUESTS, guests));
    setFormData(prev => ({ ...prev, guests: clampedGuests }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.guests;
      return newErrors;
    });
  }, []);

  const incrementGuests = useCallback(() => {
    setGuests(formData.guests + 1);
  }, [formData.guests, setGuests]);

  const decrementGuests = useCallback(() => {
    setGuests(formData.guests - 1);
  }, [formData.guests, setGuests]);

  const setTimeSlot = useCallback((timeSlotId: string) => {
    setFormData(prev => ({ ...prev, timeSlot: timeSlotId }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.timeSlot;
      return newErrors;
    });
  }, []);

  const setObservations = useCallback((observations: string) => {
    if (observations.length <= MAX_OBSERVATIONS_LENGTH) {
      setFormData(prev => ({ ...prev, observations }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.observations;
        return newErrors;
      });
    }
  }, []);

  // ========== SUBMISSÃO ==========

  /**
   * Simula o envio do formulário (front-end only)
   */
  const handleSubmit = useCallback(async () => {
    // Valida o formulário
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simula delay de API (1.5 segundos)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simula sucesso
    setIsSubmitting(false);
    setIsSuccess(true);

    // Log dos dados (para desenvolvimento)
    console.log('Reserva simulada:', formData);
  }, [formData, validateForm]);

  /**
   * Reseta o formulário para o estado inicial
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    availableTimeSlots,
    setDate,
    setEnvironment,
    setGuests,
    setTimeSlot,
    setObservations,
    incrementGuests,
    decrementGuests,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
  };
};

