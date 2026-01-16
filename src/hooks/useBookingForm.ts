/**
 * Hook customizado para gerenciar o formulário de reservas
 * Gerencia estado, validação e submissão
 * Integrado com a API do backend
 */

import { useState, useCallback, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { BookingFormData, BookingFormErrors, TimeSlot } from '../types';
import {
  isDateValid,
  MIN_GUESTS,
  MAX_GUESTS,
  MAX_OBSERVATIONS_LENGTH,
} from '../data/bookingData';
import { emailConfig } from '../config/emailjs';
import { bookingsApi, ApiError } from '../services/api';
import type { ApiTimeSlot } from '../services/api';

interface UseBookingFormReturn {
  formData: BookingFormData;
  errors: BookingFormErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  isLoadingSlots: boolean;
  availableTimeSlots: TimeSlot[];
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
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
  name: '',
  email: '',
  phone: '',
  date: null,
  environment: null,
  guests: 2, // Padrão: 2 pessoas (casal)
  timeSlot: null,
  observations: '',
};

/**
 * Converte slots da API para o formato do frontend
 */
const mapApiSlotsToTimeSlots = (
  apiSlots: ApiTimeSlot[],
  environment: 'indoor' | 'outdoor' | null
): TimeSlot[] => {
  return apiSlots.map((slot) => {
    // Determina disponibilidade baseado no ambiente selecionado
    let available = true;
    if (environment === 'indoor') {
      available = slot.availableIndoor;
    } else if (environment === 'outdoor') {
      available = slot.availableOutdoor;
    } else {
      // Se nenhum ambiente selecionado, mostra disponível se algum estiver
      available = slot.availableIndoor || slot.availableOutdoor;
    }

    return {
      id: `slot-${slot.time.replace(':', '')}`,
      time: slot.time,
      label: slot.time,
      available,
    };
  });
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
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [apiTimeSlots, setApiTimeSlots] = useState<ApiTimeSlot[]>([]);

  // Busca disponibilidade quando a data muda
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!formData.date) {
        setAvailableTimeSlots([]);
        setApiTimeSlots([]);
        return;
      }

      setIsLoadingSlots(true);

      try {
        const dateStr = format(formData.date, 'yyyy-MM-dd');
        const availability = await bookingsApi.checkAvailability(dateStr);
        setApiTimeSlots(availability.timeSlots);
        setAvailableTimeSlots(
          mapApiSlotsToTimeSlots(availability.timeSlots, formData.environment)
        );
      } catch (error) {
        console.error('Erro ao buscar disponibilidade:', error);
        setAvailableTimeSlots([]);
        setApiTimeSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [formData.date]);

  // Atualiza slots quando o ambiente muda
  useEffect(() => {
    if (apiTimeSlots.length > 0) {
      setAvailableTimeSlots(
        mapApiSlotsToTimeSlots(apiTimeSlots, formData.environment)
      );
    }
  }, [formData.environment, apiTimeSlots]);

  // ========== VALIDAÇÃO DE CAMPOS ==========

  /**
   * Valida um campo específico
   */
  const validateField = useCallback(
    (field: keyof BookingFormData): boolean => {
      let error = '';

      switch (field) {
        case 'name':
          if (!formData.name.trim()) {
            error = 'Por favor, informe seu nome completo';
          } else if (formData.name.trim().length < 3) {
            error = 'Nome deve ter pelo menos 3 caracteres';
          } else if (formData.name.trim().length > 100) {
            error = 'Nome muito longo (máximo 100 caracteres)';
          }
          break;

        case 'email':
          if (!formData.email.trim()) {
            error = 'Por favor, informe seu e-mail';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            error = 'E-mail inválido';
          }
          break;

        case 'phone':
          // Remove a máscara para validar apenas os números
          const phoneNumbers = formData.phone.replace(/\D/g, '');
          if (!phoneNumbers) {
            error = 'Por favor, informe seu telefone';
          } else if (phoneNumbers.length < 10) {
            error = 'Telefone inválido. Digite DDD + número';
          } else if (phoneNumbers.length > 11) {
            error = 'Telefone inválido';
          }
          break;

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
          } else {
            // Verifica se o slot ainda está disponível
            const selectedSlot = availableTimeSlots.find(
              (s) => s.id === formData.timeSlot
            );
            if (selectedSlot && !selectedSlot.available) {
              error = 'Este horário não está mais disponível';
            }
          }
          break;

        case 'observations':
          if (formData.observations.length > MAX_OBSERVATIONS_LENGTH) {
            error = `Máximo de ${MAX_OBSERVATIONS_LENGTH} caracteres`;
          }
          break;
      }

      if (error) {
        setErrors((prev) => ({ ...prev, [field]: error }));
        return false;
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
        return true;
      }
    },
    [formData, availableTimeSlots]
  );

  /**
   * Valida todos os campos do formulário
   */
  const validateForm = useCallback((): boolean => {
    const nameValid = validateField('name');
    const emailValid = validateField('email');
    const phoneValid = validateField('phone');
    const dateValid = validateField('date');
    const environmentValid = validateField('environment');
    const guestsValid = validateField('guests');
    const timeSlotValid = validateField('timeSlot');
    const observationsValid = validateField('observations');

    return (
      nameValid &&
      emailValid &&
      phoneValid &&
      dateValid &&
      environmentValid &&
      guestsValid &&
      timeSlotValid &&
      observationsValid
    );
  }, [validateField]);

  // ========== SETTERS DE CAMPOS ==========

  const setName = useCallback((name: string) => {
    setFormData((prev) => ({ ...prev, name }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.name;
      return newErrors;
    });
  }, []);

  const setEmail = useCallback((email: string) => {
    setFormData((prev) => ({ ...prev, email }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.email;
      return newErrors;
    });
  }, []);

  const setPhone = useCallback((phone: string) => {
    setFormData((prev) => ({ ...prev, phone }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.phone;
      return newErrors;
    });
  }, []);

  const setDate = useCallback((date: Date | null) => {
    setFormData((prev) => ({ ...prev, date, timeSlot: null })); // Reset timeSlot quando mudar data
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.date;
      delete newErrors.timeSlot;
      return newErrors;
    });
  }, []);

  const setEnvironment = useCallback((environment: 'indoor' | 'outdoor') => {
    setFormData((prev) => ({ ...prev, environment, timeSlot: null })); // Reset timeSlot quando mudar ambiente
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.environment;
      delete newErrors.timeSlot;
      return newErrors;
    });
  }, []);

  const setGuests = useCallback((guests: number) => {
    const clampedGuests = Math.max(MIN_GUESTS, Math.min(MAX_GUESTS, guests));
    setFormData((prev) => ({ ...prev, guests: clampedGuests }));
    setErrors((prev) => {
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
    setFormData((prev) => ({ ...prev, timeSlot: timeSlotId }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.timeSlot;
      return newErrors;
    });
  }, []);

  const setObservations = useCallback((observations: string) => {
    if (observations.length <= MAX_OBSERVATIONS_LENGTH) {
      setFormData((prev) => ({ ...prev, observations }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.observations;
        return newErrors;
      });
    }
  }, []);

  // ========== SUBMISSÃO ==========

  /**
   * Envia o formulário para a API e notifica por email
   */
  const handleSubmit = useCallback(async () => {
    // Valida o formulário
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Formatar dados para a API
      const timeSlotFormatted =
        formData.timeSlot?.replace('slot-', '').replace(/(\d{2})(\d{2})/, '$1:$2') || '';

      const bookingData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        date: format(formData.date!, 'yyyy-MM-dd'),
        timeSlot: timeSlotFormatted,
        environment: formData.environment === 'indoor' ? 'INDOOR' : 'OUTDOOR',
        guests: formData.guests,
        observations: formData.observations || undefined,
      } as const;

      console.log('📤 Enviando reserva para a API...', bookingData);

      // Enviar para a API do backend
      const bookingResponse = await bookingsApi.create(bookingData);

      console.log('✅ Reserva criada com sucesso!', bookingResponse);

      // Formatar dados para o email de confirmação
      const emailData = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        booking_date: formData.date
          ? format(formData.date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
          : '',
        booking_day: formData.date ? format(formData.date, 'EEEE', { locale: ptBR }) : '',
        booking_time: timeSlotFormatted,
        booking_environment:
          formData.environment === 'indoor'
            ? 'Salão (Ambiente Interno Climatizado)'
            : 'Ambiente Externo (Área Aberta ao Ar Livre)',
        booking_guests: `${formData.guests} ${formData.guests === 1 ? 'pessoa' : 'pessoas'}`,
        booking_observations: formData.observations || 'Nenhuma observação',
        booking_id: bookingResponse.id,
      };

      console.log('📧 Enviando confirmação de reserva por email...');

      // Enviar email usando EmailJS
      try {
        const response = await emailjs.send(
          emailConfig.serviceId,
          emailConfig.templateId,
          emailData,
          emailConfig.publicKey
        );
        console.log('✅ Email enviado com sucesso!', response);
      } catch (emailError) {
        console.warn('⚠️ Erro ao enviar email, mas reserva foi criada:', emailError);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      console.error('❌ Erro ao criar reserva:', error);
      setIsSubmitting(false);

      if (error instanceof ApiError) {
        if (error.status === 409) {
          alert('Este horário acabou de ser reservado. Por favor, escolha outro horário.');
          // Recarrega disponibilidade
          if (formData.date) {
            const dateStr = format(formData.date, 'yyyy-MM-dd');
            const availability = await bookingsApi.checkAvailability(dateStr);
            setApiTimeSlots(availability.timeSlots);
            setAvailableTimeSlots(
              mapApiSlotsToTimeSlots(availability.timeSlots, formData.environment)
            );
          }
        } else {
          alert(`Erro ao criar reserva: ${error.message}`);
        }
      } else {
        alert('Erro ao criar reserva. Tente novamente.');
      }
    }
  }, [formData, validateForm]);

  /**
   * Reseta o formulário para o estado inicial
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    setAvailableTimeSlots([]);
    setApiTimeSlots([]);
  }, []);

  return {
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
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
  };
};
