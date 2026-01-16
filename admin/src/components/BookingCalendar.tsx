/**
 * BookingCalendar
 * Calendário interativo estilo Apple para visualização de reservas
 */

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Users, Clock, MapPin } from 'lucide-react';
import type { Booking } from '../types';

interface BookingCalendarProps {
  bookings: Booking[];
}

export function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Nomes dos meses em português
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Dias da semana abreviados
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Gerar dias do mês
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: (Date | null)[] = [];
    
    // Dias vazios antes do primeiro dia do mês
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Dias do mês
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [currentDate]);

  // Agrupar reservas por data
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    
    bookings.forEach(booking => {
      const dateKey = booking.date.split('T')[0]; // YYYY-MM-DD
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, booking]);
    });
    
    return map;
  }, [bookings]);

  // Reservas do dia selecionado
  const selectedDateBookings = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = selectedDate.toISOString().split('T')[0];
    return bookingsByDate.get(dateKey) || [];
  }, [selectedDate, bookingsByDate]);

  // Navegação
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Verificar se é hoje
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Verificar se está selecionado
  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Contar reservas de um dia
  const getBookingCount = (date: Date | null) => {
    if (!date) return 0;
    const dateKey = date.toISOString().split('T')[0];
    return bookingsByDate.get(dateKey)?.length || 0;
  };

  // Formatar data para exibição
  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Confirmada';
      case 'PENDING': return 'Pendente';
      case 'CANCELLED': return 'Cancelada';
      default: return status;
    }
  };

  const getEnvironmentLabel = (env: string) => {
    return env === 'INDOOR' ? 'Interno' : 'Externo';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendário */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header do calendário */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                Hoje
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Dias da semana */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDays.map(day => (
            <div
              key={day}
              className="py-3 text-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid do calendário */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const bookingCount = getBookingCount(date);
            const today = isToday(date);
            const selected = isSelected(date);
            
            return (
              <button
                key={index}
                onClick={() => date && setSelectedDate(date)}
                disabled={!date}
                className={`
                  relative h-20 p-2 border-b border-r border-gray-50
                  transition-all duration-200 ease-out
                  ${!date ? 'bg-gray-50/50' : 'hover:bg-amber-50 cursor-pointer'}
                  ${selected ? 'bg-amber-50 ring-2 ring-amber-500 ring-inset z-10' : ''}
                `}
              >
                {date && (
                  <>
                    <span
                      className={`
                        inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                        transition-all duration-200
                        ${today && !selected ? 'bg-amber-600 text-white' : ''}
                        ${selected ? 'bg-amber-600 text-white scale-110' : ''}
                        ${!today && !selected ? 'text-gray-700 hover:bg-gray-100' : ''}
                      `}
                    >
                      {date.getDate()}
                    </span>
                    
                    {/* Indicadores de reserva */}
                    {bookingCount > 0 && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {bookingCount <= 3 ? (
                          // Até 3 reservas: mostrar pontos
                          Array.from({ length: bookingCount }).map((_, i) => (
                            <span
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${
                                selected ? 'bg-amber-700' : 'bg-amber-500'
                              }`}
                            />
                          ))
                        ) : (
                          // Mais de 3: mostrar número
                          <span className={`
                            text-xs font-semibold px-1.5 py-0.5 rounded-full
                            ${selected ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-700'}
                          `}>
                            {bookingCount}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Reservas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-medium">
                {new Date().getDate()}
              </span>
              <span>Hoje</span>
            </div>
          </div>
        </div>
      </div>

      {/* Painel lateral - Detalhes do dia */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <h4 className="font-semibold text-gray-900">
            {selectedDate ? (
              <span className="capitalize">{formatSelectedDate(selectedDate)}</span>
            ) : (
              'Selecione uma data'
            )}
          </h4>
          {selectedDate && (
            <p className="text-sm text-gray-500 mt-0.5">
              {selectedDateBookings.length} reserva{selectedDateBookings.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto">
          {!selectedDate ? (
            <div className="text-center py-12 text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Clock size={24} />
              </div>
              <p className="text-sm">Clique em um dia para ver as reservas</p>
            </div>
          ) : selectedDateBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Users size={24} />
              </div>
              <p className="text-sm">Nenhuma reserva neste dia</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDateBookings
                .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot))
                .map(booking => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{booking.customerName}</p>
                        <p className="text-sm text-gray-500">{booking.customerEmail}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadge(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" />
                        <span>{booking.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-gray-400" />
                        <span>{booking.guests} pessoa{booking.guests !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{getEnvironmentLabel(booking.environment)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

