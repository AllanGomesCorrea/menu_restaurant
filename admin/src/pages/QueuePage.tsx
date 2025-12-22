import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { QueueEntry, QueueStats, QueueStatus } from '../types';

const STATUS_LABELS: Record<QueueStatus, string> = {
  WAITING: 'Aguardando',
  CALLED: 'Chamado',
  SEATED: 'Sentou',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Não Veio',
  EXPIRED: 'Expirado',
};

const STATUS_COLORS: Record<QueueStatus, string> = {
  WAITING: 'bg-blue-100 text-blue-800',
  CALLED: 'bg-green-100 text-green-800 animate-pulse',
  SEATED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-orange-100 text-orange-800',
  EXPIRED: 'bg-gray-100 text-gray-500',
};

export function QueuePage() {
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<QueueStatus | 'ALL'>('ALL');
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [entriesData, statsData] = await Promise.all([
        api.getQueueEntries(filter === 'ALL' ? undefined : { status: filter }),
        api.getQueueStats(),
      ]);
      setEntries(entriesData.data);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar fila');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadData();
    // Auto-refresh a cada 10 segundos
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleCall = async (id: string) => {
    setActionLoading(id);
    try {
      await api.callQueueEntry(id);
      await loadData();
    } catch (err) {
      alert('Erro ao chamar cliente');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSeat = async (id: string) => {
    setActionLoading(id);
    try {
      await api.seatQueueEntry(id);
      await loadData();
    } catch (err) {
      alert('Erro ao marcar como sentado');
    } finally {
      setActionLoading(null);
    }
  };

  const handleNoShow = async (id: string) => {
    setActionLoading(id);
    try {
      await api.noShowQueueEntry(id);
      await loadData();
    } catch (err) {
      alert('Erro ao marcar como não veio');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancelar esta entrada?')) return;
    setActionLoading(id);
    try {
      await api.cancelQueueEntry(id);
      await loadData();
    } catch (err) {
      alert('Erro ao cancelar');
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearQueue = async () => {
    if (!confirm('Limpar toda a fila do dia? Esta ação não pode ser desfeita.')) return;
    try {
      const result = await api.clearQueue();
      alert(result.message);
      await loadData();
    } catch (err) {
      alert('Erro ao limpar fila');
    }
  };

  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
    }
    return phone;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fila Digital</h1>
          <p className="text-gray-500">Gerencie a fila de espera do restaurante</p>
        </div>
        <button
          onClick={handleClearQueue}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
        >
          Limpar Fila do Dia
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-700">{stats.waiting}</div>
            <div className="text-sm text-blue-600">Aguardando</div>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-700">{stats.called}</div>
            <div className="text-sm text-green-600">Chamados</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-gray-700">{stats.seated}</div>
            <div className="text-sm text-gray-600">Sentados</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-orange-700">{stats.noShow}</div>
            <div className="text-sm text-orange-600">Não Vieram</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-red-700">{stats.cancelled}</div>
            <div className="text-sm text-red-600">Cancelados</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'WAITING', 'CALLED', 'SEATED', 'NO_SHOW', 'CANCELLED'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' ? 'Todos' : STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Queue List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <p className="text-gray-500">Nenhuma entrada na fila</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Posição
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Telefone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pessoas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Entrada
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`hover:bg-gray-50 ${
                      entry.status === 'CALLED' ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      {entry.status === 'WAITING' && entry.position ? (
                        <span className="text-2xl font-bold text-amber-600">
                          #{entry.position}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-gray-900">
                        {entry.code}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{entry.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <a
                        href={`tel:${entry.phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {formatPhone(entry.phone)}
                      </a>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full font-semibold">
                        {entry.partySize}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {formatTime(entry.createdAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[entry.status]
                        }`}
                      >
                        {STATUS_LABELS[entry.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {entry.status === 'WAITING' && (
                          <button
                            onClick={() => handleCall(entry.id)}
                            disabled={actionLoading === entry.id}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                          >
                            {actionLoading === entry.id ? '...' : 'Chamar'}
                          </button>
                        )}
                        {entry.status === 'CALLED' && (
                          <>
                            <button
                              onClick={() => handleSeat(entry.id)}
                              disabled={actionLoading === entry.id}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              Sentou
                            </button>
                            <button
                              onClick={() => handleNoShow(entry.id)}
                              disabled={actionLoading === entry.id}
                              className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                            >
                              Não Veio
                            </button>
                          </>
                        )}
                        {(entry.status === 'WAITING' || entry.status === 'CALLED') && (
                          <button
                            onClick={() => handleCancel(entry.id)}
                            disabled={actionLoading === entry.id}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50 transition-colors"
                          >
                            Cancelar
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

      {/* Auto-refresh indicator */}
      <p className="text-center text-sm text-gray-400">
        Atualizando automaticamente a cada 10 segundos
      </p>
    </div>
  );
}

