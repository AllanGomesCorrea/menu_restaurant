/**
 * Componente DatePicker
 * Seletor de data com calendário interativo
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { formatDateShort, getDayOfWeekName } from '../../data/bookingData';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  error?: string;
  className?: string;
}

/**
 * Seletor de data com calendário visual
 * Permite selecionar datas futuras (bloqueia passadas)
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateSelect,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Gera os dias do mês atual
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysCount = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Preenche os dias vazios antes do início do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Preenche os dias do mês
    for (let day = 1; day <= daysCount; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  // Navegação do calendário
  const goToPreviousMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const goToNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  // Verifica se uma data é hoje
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Verifica se uma data está no passado
  const isPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Verifica se uma data está selecionada
  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Handler de seleção de data
  const handleDateSelect = (e: React.MouseEvent, date: Date) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPast(date)) {
      onDateSelect(date);
      setIsOpen(false);
    }
  };

  // Formato do mês/ano do header
  const monthYearDisplay = currentMonth.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={cn('relative', className)}>
      {/* Label */}
      <label className="block text-sm font-medium text-primary-900 mb-2">
        Data da Reserva
      </label>

      {/* Input Display */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-3 rounded-lg border-2',
          'text-left flex items-center justify-between',
          'transition-all duration-200',
          error
            ? 'border-red-500 bg-red-50 focus:ring-red-500'
            : 'border-primary-300 bg-white hover:border-primary-500 focus:ring-primary-500',
          'focus:outline-none focus:ring-2'
        )}
        whileTap={{ scale: 0.98 }}
      >
        <span className={selectedDate ? 'text-primary-900' : 'text-primary-400'}>
          {selectedDate
            ? `${formatDateShort(selectedDate)} - ${getDayOfWeekName(selectedDate)}`
            : 'Selecione uma data'}
        </span>
        <svg
          className={cn(
            'w-5 h-5 transition-transform',
            isOpen && 'rotate-180',
            error ? 'text-red-500' : 'text-primary-600'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* Mensagem de erro */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-2 flex items-center gap-2"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </motion.p>
      )}

      {/* Calendário Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-primary-200 p-4 w-full md:w-80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do calendário */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                type="button"
                onClick={(e) => goToPreviousMonth(e)}
                className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              <h3 className="text-base font-semibold text-primary-900 capitalize">
                {monthYearDisplay}
              </h3>

              <motion.button
                type="button"
                onClick={(e) => goToNextMonth(e)}
                className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-primary-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid de dias */}
            <div className="grid grid-cols-7 gap-1">
              {daysInMonth.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const past = isPast(date);
                const today = isToday(date);
                const selected = isSelected(date);

                return (
                  <motion.button
                    key={date.toISOString()}
                    type="button"
                    onClick={(e) => handleDateSelect(e, date)}
                    disabled={past}
                    className={cn(
                      'aspect-square rounded-lg text-sm font-medium',
                      'transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500',
                      past && 'text-primary-300 cursor-not-allowed',
                      !past && !selected && 'hover:bg-primary-100 text-primary-900',
                      today && !selected && 'ring-2 ring-primary-400',
                      selected && 'bg-primary-600 text-white hover:bg-primary-700'
                    )}
                    whileHover={!past ? { scale: 1.1 } : undefined}
                    whileTap={!past ? { scale: 0.95 } : undefined}
                  >
                    {date.getDate()}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-primary-200">
              <p className="text-xs text-primary-600 text-center">
                Selecione uma data a partir de hoje
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

