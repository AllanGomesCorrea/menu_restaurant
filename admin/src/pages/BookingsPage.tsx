import { useState, useEffect } from 'react';
import { Check, X, Trash2, Filter, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../services/api';
import type { Booking, BookingStatus, BlockedSlot } from '../types';
import { useAuthStore } from '../stores/authStore';

const STATUS_OPTIONS: { value: BookingStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'CONFIRMED', label: 'Confirmadas' },
  { value: 'CANCELLED', label: 'Canceladas' },
];

// Retorna a data de hoje no formato YYYY-MM-DD
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'ALL'>('ALL');
  const [selectedDate, setSelectedDate] = useState(getTodayDateString()); // Inicia com hoje
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockDate, setBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchData();
  }, [selectedDate, selectedStatus]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params: { date?: string; status?: string } = {};
      if (selectedDate) params.date = selectedDate;
      if (selectedStatus !== 'ALL') params.status = selectedStatus;

      const [bookingsRes, blockedRes] = await Promise.all([
        api.getBookings({ ...params, limit: 100 }),
        api.getBlockedSlots({ date: selectedDate || undefined }),
      ]);

      setBookings(bookingsRes.data);
      setBlockedSlots(blockedRes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await api.updateBookingStatus(id, status);
      await fetchData();
    } catch (error: unknown) {
      console.error('Erro ao atualizar status:', error);
      
      // Extrai mensagem de erro do backend
      let message = 'Erro ao atualizar status';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          message = axiosError.response.data.message;
        }
      }
      
      alert(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta reserva?')) return;
    try {
      await api.deleteBooking(id);
      await fetchData();
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      alert('Erro ao excluir reserva');
    }
  };

  const handleBlockDay = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.blockDay(blockDate, blockReason);
      setShowBlockModal(false);
      setBlockDate('');
      setBlockReason('');
      await fetchData();
    } catch (error) {
      console.error('Erro ao bloquear dia:', error);
      alert('Erro ao bloquear dia');
    }
  };

  const handleUnblock = async (id: string) => {
    if (!confirm('Tem certeza que deseja desbloquear este horário?')) return;
    try {
      await api.deleteBlockedSlot(id);
      await fetchData();
    } catch (error) {
      console.error('Erro ao desbloquear:', error);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelada';
    }
  };

  const getEnvironmentLabel = (env: string) => {
    return env === 'INDOOR' ? 'Salão' : 'Externo';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
        {isAdmin && (
          <button onClick={() => setShowBlockModal(true)} className="btn-secondary">
            <Clock size={20} />
            Bloquear Dia
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-500" />
          <span className="font-medium text-gray-700">Filtros</span>
        </div>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="label">Data</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as BookingStatus | 'ALL')}
              className="input"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => setSelectedDate(getTodayDateString())}
              className="btn-secondary text-sm"
            >
              Hoje
            </button>
            <button
              onClick={() => setSelectedDate('')}
              className="btn-secondary text-sm"
            >
              Ver todas
            </button>
          </div>
        </div>
      </div>

      {/* Blocked Slots */}
      {blockedSlots.length > 0 && (
        <div className="card bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-800 mb-3">Horários Bloqueados</h3>
          <div className="flex flex-wrap gap-2">
            {blockedSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-red-200"
              >
                <Calendar size={16} className="text-red-600" />
                <span className="text-sm text-gray-700">
                  {(() => {
                    const dateStr = slot.date.split('T')[0];
                    const [year, month, day] = dateStr.split('-').map(Number);
                    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
                  })()}
                  {slot.timeSlot && ` - ${slot.timeSlot}`}
                </span>
                {slot.reason && (
                  <span className="text-xs text-gray-500">({slot.reason})</span>
                )}
                {isAdmin && (
                  <button
                    onClick={() => handleUnblock(slot.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="card overflow-hidden">
        {bookings.length === 0 ? (
          <p className="text-gray-500 text-center py-12">
            Nenhuma reserva encontrada
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Data/Hora
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Ambiente
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Pessoas
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.customerName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.customerEmail}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.customerPhone}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">
                        {(() => {
                          // Parse date as UTC to avoid timezone shift
                          const dateStr = booking.date.split('T')[0];
                          const [year, month, day] = dateStr.split('-').map(Number);
                          const localDate = new Date(year, month - 1, day);
                          return format(localDate, "dd/MM/yyyy (EEEE)", { locale: ptBR });
                        })()}
                      </p>
                      <p className="text-sm text-gray-500">{booking.timeSlot}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {getEnvironmentLabel(booking.environment)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{booking.guests}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          booking.status
                        )}`}
                      >
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {/* Reserva confirmada - pode cancelar (libera o horário) */}
                        {booking.status === 'CONFIRMED' && (
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, 'CANCELLED')
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Cancelar reserva (libera o horário)"
                          >
                            <X size={18} />
                          </button>
                        )}
                        {/* Reserva cancelada - pode reconfirmar (bloqueia o horário novamente) */}
                        {booking.status === 'CANCELLED' && (
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, 'CONFIRMED')
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Reconfirmar reserva"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Block Day Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Bloquear Dia Inteiro
              </h2>
            </div>
            <form onSubmit={handleBlockDay} className="p-6 space-y-4">
              <div>
                <label className="label">Data</label>
                <input
                  type="date"
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">Motivo (opcional)</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="input"
                  placeholder="Ex: Feriado, evento privado..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-danger flex-1">
                  Bloquear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

