/**
 * Página QueueStatusPage
 * Exibe o status da posição na fila digital
 * Acessível via link único: /fila/:code
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface QueueStatusResponse {
  code: string;
  name: string;
  position: number;
  peopleAhead: number;
  status: string;
  estimatedWaitMinutes?: number;
  message: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const QueueStatusPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [statusInfo, setStatusInfo] = useState<QueueStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchStatus = async () => {
    if (!code) return;

    try {
      const response = await fetch(`${API_URL}/queue/status/${code.toUpperCase()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Código não encontrado');
      }

      setStatusInfo(data);
      setError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar status');
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar status inicial
  useEffect(() => {
    fetchStatus();
  }, [code]);

  // Auto-refresh a cada 10 segundos enquanto aguardando ou chamado
  useEffect(() => {
    if (!statusInfo) return;
    
    // Só faz polling se estiver aguardando ou foi chamado
    if (statusInfo.status !== 'WAITING' && statusInfo.status !== 'CALLED') {
      return;
    }

    const interval = setInterval(() => {
      fetchStatus();
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [statusInfo?.status, code]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copiado!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-700">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Código não encontrado</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Voltar ao início
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!statusInfo) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING': return 'blue';
      case 'CALLED': return 'green';
      case 'SEATED': return 'gray';
      default: return 'red';
    }
  };

  const color = getStatusColor(statusInfo.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header com logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="A Casa do Porco" className="h-20 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-primary-900">Fila Digital</h1>
        </div>

        {/* Card principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Status header */}
          <div className={cn(
            'px-6 py-5 text-white',
            color === 'blue' && 'bg-gradient-to-r from-blue-600 to-blue-700',
            color === 'green' && 'bg-gradient-to-r from-green-500 to-green-600',
            color === 'gray' && 'bg-gradient-to-r from-gray-500 to-gray-600',
            color === 'red' && 'bg-gradient-to-r from-red-500 to-red-600'
          )}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Olá,</p>
                <p className="text-xl font-bold">{statusInfo.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70">Código</p>
                <p className="font-mono font-bold text-lg">{statusInfo.code}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Waiting status */}
            {statusInfo.status === 'WAITING' && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <div>
                  <p className="text-gray-600 mb-2">Sua posição na fila</p>
                  <div className="text-7xl font-bold text-primary-700">
                    #{statusInfo.position}
                  </div>
                </div>

                {statusInfo.position === 1 ? (
                  <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                    <p className="text-green-700 font-bold text-lg">
                      Você é o próximo!
                    </p>
                    <p className="text-sm text-green-600">
                      Aguarde ser chamado
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-blue-700">
                      <span className="font-semibold text-xl">{statusInfo.peopleAhead}</span>
                      <span className="text-base"> grupo(s) à sua frente</span>
                    </p>
                    {statusInfo.estimatedWaitMinutes && (
                      <p className="text-blue-600 mt-2">
                        Tempo estimado: <span className="font-semibold">~{statusInfo.estimatedWaitMinutes} min</span>
                      </p>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </p>
              </div>
            )}

            {/* Called status */}
            {statusInfo.status === 'CALLED' && (
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                >
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </motion.div>

                <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6">
                  <p className="text-3xl font-bold text-green-700 mb-2">
                    🔔 SUA VEZ CHEGOU!
                  </p>
                  <p className="text-green-600 text-lg">
                    Por favor, dirija-se à recepção
                  </p>
                </div>
              </div>
            )}

            {/* Seated status */}
            {statusInfo.status === 'SEATED' && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-xl font-bold text-gray-700 mb-2">
                    Você já foi atendido
                  </p>
                  <p className="text-gray-500 text-lg">
                    Bom apetite! 🍽️
                  </p>
                </div>
              </div>
            )}

            {/* Cancelled/NoShow/Expired status */}
            {(statusInfo.status === 'CANCELLED' || statusInfo.status === 'NO_SHOW' || statusInfo.status === 'EXPIRED') && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <p className="text-red-700 font-medium text-lg">
                    {statusInfo.message}
                  </p>
                </div>

                <Link
                  to="/"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Entrar na Fila Novamente
                </Link>
              </div>
            )}

            {/* Actions */}
            {(statusInfo.status === 'WAITING' || statusInfo.status === 'CALLED') && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={fetchStatus}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Atualizar
                </button>
                <button
                  onClick={copyLink}
                  className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Dica */}
        {statusInfo.status === 'WAITING' && (
          <p className="text-center text-sm text-gray-500 mt-6">
            💡 Esta página atualiza automaticamente a cada 10 segundos
          </p>
        )}

        {/* Link para voltar */}
        <div className="text-center mt-8">
          <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
};



