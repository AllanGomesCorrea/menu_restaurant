/**
 * Dados e configurações para o sistema de reservas
 * Horários, ambientes e regras de disponibilidade
 */

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TimeSlot, BookingEnvironment } from '../types';

// ========== HORÁRIOS DE FUNCIONAMENTO ==========

// Segunda a Sexta: 11h às 23h
// Sábado e Domingo: 11h às 00h (meia-noite)

/**
 * Gera slots de horários em horas cheias apenas
 * @param startHour - Hora inicial (ex: 11)
 * @param endHour - Hora final (ex: 23)
 * @returns Array de TimeSlots
 */
export const generateTimeSlots = (startHour: number, endHour: number): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    // Apenas horas cheias (sem :30)
    const displayHour = hour % 24;
    const timeString = `${displayHour.toString().padStart(2, '0')}:00`;
    const id = `slot-${timeString.replace(':', '')}`;
    
    slots.push({
      id,
      time: timeString,
      label: timeString,
      available: true, // Por padrão, todos são disponíveis (front-end only)
    });
  }
  
  return slots;
};

// Horários para dias de semana (Segunda a Sexta): 11h às 23h
export const weekdayTimeSlots: TimeSlot[] = generateTimeSlots(11, 23);

// Horários para fim de semana (Sábado e Domingo): 11h às 00h (meia-noite)
export const weekendTimeSlots: TimeSlot[] = generateTimeSlots(11, 23).concat([
  {
    id: 'slot-0000',
    time: '00:00',
    label: '00:00',
    available: true,
  }
]);

/**
 * Retorna os slots de horário baseado no dia da semana
 * @param date - Data selecionada
 * @returns Array de TimeSlots disponíveis
 */
export const getTimeSlotsForDate = (date: Date): TimeSlot[] => {
  const dayOfWeek = date.getDay();
  // 0 = Domingo, 6 = Sábado
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  return isWeekend ? weekendTimeSlots : weekdayTimeSlots;
};

// ========== AMBIENTES DISPONÍVEIS ==========

export interface EnvironmentOption {
  id: BookingEnvironment;
  name: string;
  description: string;
  icon: string;
  image: string; // Imagem do ambiente
  features: string[];
}

export const environmentOptions: EnvironmentOption[] = [
  {
    id: 'indoor',
    name: 'Salão',
    description: 'Ambiente interno climatizado',
    icon: '🏠',
    image: '/ambiente.jpg',
    features: [
      'Ar condicionado',
      'Música ambiente',
      'Ambiente aconchegante',
    ],
  },
  {
    id: 'outdoor',
    name: 'Ambiente Externo',
    description: 'Área aberta ao ar livre',
    icon: '🌳',
    image: '/ambiente_externo.jpg',
    features: [
      'Ar livre',
      'Contato com natureza',
      'Vista agradável',
    ],
  },
];

// ========== CAPACIDADE DE PESSOAS ==========

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 6;

/**
 * Mensagem de descrição baseada no número de pessoas
 */
export const getGuestsDescription = (guests: number): string => {
  if (guests === 1) return 'Individual';
  if (guests === 2) return 'Casal';
  if (guests <= 4) return 'Grupo pequeno';
  return 'Grupo grande';
};

// ========== VALIDAÇÃO E REGRAS ==========

/**
 * Verifica se uma data é válida para reserva
 * (Não pode ser no passado)
 */
export const isDateValid = (date: Date | null): boolean => {
  if (!date) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  
  return selectedDate >= today;
};

/**
 * Formata a data para exibição (ex: "15 de Dezembro de 2025")
 */
export const formatDateDisplay = (date: Date): string => {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

/**
 * Formata a data para exibição curta (ex: "15/12/2025")
 */
export const formatDateShort = (date: Date): string => {
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
};

/**
 * Retorna o nome do dia da semana
 */
export const getDayOfWeekName = (date: Date): string => {
  return format(date, 'EEEE', { locale: ptBR });
};

// ========== OBSERVAÇÕES ==========

export const MAX_OBSERVATIONS_LENGTH = 500;
export const OBSERVATIONS_PLACEHOLDER = 
  'Possui alguma restrição alimentar? Comemora alguma ocasião especial? Deixe aqui suas observações...';

