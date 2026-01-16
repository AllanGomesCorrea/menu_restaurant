import { useEffect, useState } from 'react';
import { Calendar, UtensilsCrossed, Clock, Users } from 'lucide-react';
import api from '../services/api';
import type { Booking } from '../types';
import { BookingCalendar } from '../components/BookingCalendar';

interface Stats {
  todayBookings: number;
  pendingBookings: number;
  totalMenuItems: number;
  totalUsers: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    todayBookings: 0,
    pendingBookings: 0,
    totalMenuItems: 0,
    totalUsers: 0,
  });
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, menuItems, usersRes] = await Promise.all([
          api.getBookings({ limit: 500 }), // Buscar mais para o calendário
          api.getMenuItems(),
          api.getUsers({ limit: 1 }),
        ]);

        const today = new Date().toISOString().split('T')[0];
        const todayBookings = bookingsRes.data.filter((b) =>
          b.date.startsWith(today)
        ).length;
        const pendingBookings = bookingsRes.data.filter(
          (b) => b.status === 'PENDING'
        ).length;

        setStats({
          todayBookings,
          pendingBookings,
          totalMenuItems: menuItems.length,
          totalUsers: usersRes.total,
        });

        // Guardar todas as reservas para o calendário
        setAllBookings(bookingsRes.data);

        // Filtrar e ordenar para pegar as 5 próximas reservas (a partir de hoje)
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        const upcoming = bookingsRes.data
          .filter((b) => {
            // Extrair data da reserva sem timezone
            const [year, month, day] = b.date.split('T')[0].split('-');
            const bookingDate = new Date(Number(year), Number(month) - 1, Number(day));
            // Só reservas confirmadas ou pendentes de hoje em diante
            return bookingDate >= now && b.status !== 'CANCELLED';
          })
          .sort((a, b) => {
            // Ordenar por data + horário
            const dateCompare = a.date.split('T')[0].localeCompare(b.date.split('T')[0]);
            if (dateCompare !== 0) return dateCompare;
            return a.timeSlot.localeCompare(b.timeSlot);
          })
          .slice(0, 5);

        setUpcomingBookings(upcoming);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-800"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Reservas Hoje',
      value: stats.todayBookings,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      label: 'Reservas Pendentes',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      label: 'Itens no Cardápio',
      value: stats.totalMenuItems,
      icon: UtensilsCrossed,
      color: 'bg-green-500',
    },
    {
      label: 'Usuários',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Função para formatar data sem problemas de timezone
  const formatDate = (dateString: string) => {
    // dateString vem como "2025-01-06" (YYYY-MM-DD)
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Próximas Reservas */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Próximas Reservas
          </h2>
          <span className="text-sm text-gray-500">
            As 5 mais próximas
          </span>
        </div>
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Nenhuma reserva próxima encontrada
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Cliente
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Data
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Horário
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Pessoas
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingBookings.map((booking) => (
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
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {formatDate(booking.date)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {booking.timeSlot}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Calendário de Reservas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Calendário de Reservas
        </h2>
        <BookingCalendar bookings={allBookings} />
      </div>
    </div>
  );
}

