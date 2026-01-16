/**
 * Componente QueueModal
 * Modal para entrada na fila digital
 * Permite cadastro e mostra posição após confirmação
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface QueueResponse {
  code: string;
  name: string;
  position: number;
  peopleAhead: number;
}

interface QueueStatusResponse {
  code: string;
  name: string;
  position: number;
  peopleAhead: number;
  status: string;
  estimatedWaitMinutes?: number;
  message: string;
}

interface QueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const QueueModal: React.FC<QueueModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success' | 'check'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(2);
  
  // Result state
  const [queueInfo, setQueueInfo] = useState<QueueResponse | null>(null);
  const [statusInfo, setStatusInfo] = useState<QueueStatusResponse | null>(null);
  
  // Check code state
  const [checkCode, setCheckCode] = useState('');

  // Carregar código salvo do localStorage
  useEffect(() => {
    const savedCode = localStorage.getItem('queueCode');
    if (savedCode && isOpen) {
      setCheckCode(savedCode);
      handleCheckStatus(savedCode, true); // true = veio do localStorage
    }
  }, [isOpen]);

  // Auto-refresh a cada 10 segundos quando estiver visualizando status (WAITING ou CALLED)
  useEffect(() => {
    if (!isOpen || step !== 'check' || !statusInfo) return;
    
    // Só faz polling se estiver aguardando ou foi chamado
    if (statusInfo.status !== 'WAITING' && statusInfo.status !== 'CALLED') {
      return;
    }

    const interval = setInterval(() => {
      handleCheckStatus(statusInfo.code);
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [isOpen, step, statusInfo?.status, statusInfo?.code]);

  /**
   * Aplica máscara de telefone brasileiro
   * Formato: (11) 98765-4321 ou (11) 3456-7890
   */
  const formatPhone = (value: string): string => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara conforme o tamanho
    if (numbers.length <= 2) {
      return numbers.length ? `(${numbers}` : '';
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      // Celular com 9 dígitos
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  /**
   * Remove a máscara e retorna apenas os números
   */
  const getPhoneNumbers = (value: string): string => {
    return value.replace(/\D/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: getPhoneNumbers(phone),
          partySize,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409 && data.code) {
          // Já está na fila
          setQueueInfo({
            code: data.code,
            name,
            position: data.position,
            peopleAhead: data.position - 1,
          });
          localStorage.setItem('queueCode', data.code);
          setStep('success');
          return;
        }
        throw new Error(data.message || 'Erro ao entrar na fila');
      }

      setQueueInfo(data);
      localStorage.setItem('queueCode', data.code);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar na fila');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckStatus = async (code?: string, isFromLocalStorage = false) => {
    const codeToCheck = code || checkCode;
    if (!codeToCheck) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/queue/status/${codeToCheck.toUpperCase()}`);
      const data = await response.json();

      if (!response.ok) {
        // Se o código veio do localStorage e não existe mais, limpar e mostrar form
        if (isFromLocalStorage && response.status === 404) {
          localStorage.removeItem('queueCode');
          setCheckCode('');
          setStep('form');
          // Não mostrar erro, apenas voltar ao formulário silenciosamente
          return;
        }
        throw new Error(data.message || 'Código não encontrado');
      }

      setStatusInfo(data);
      setStep('check');
    } catch (err) {
      // Se veio do localStorage e deu erro, limpar e ir pro form
      if (isFromLocalStorage) {
        localStorage.removeItem('queueCode');
        setCheckCode('');
        setStep('form');
        return;
      }
      setError(err instanceof Error ? err.message : 'Erro ao verificar status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setError(null);
    setQueueInfo(null);
    setStatusInfo(null);
    onClose();
  };

  const handleNewEntry = () => {
    localStorage.removeItem('queueCode');
    setStep('form');
    setCheckCode('');
    setStatusInfo(null);
    setName('');
    setPhone('');
    setPartySize(2);
  };

  const copyLink = () => {
    const code = queueInfo?.code || statusInfo?.code;
    if (code) {
      const link = `${window.location.origin}/fila/${code}`;
      navigator.clipboard.writeText(link);
      alert('Link copiado!');
    }
  };

  // Usar portal para renderizar fora do header, diretamente no body
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - z-index muito alto para ficar acima de tudo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
            onClick={handleClose}
          />

          {/* Modal Container - centralizado na tela */}
          <div 
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{ zIndex: 10000 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-700 to-primary-800 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Fila Digital</h2>
                      <p className="text-sm text-white/80">
                        {step === 'form' && 'Entre na fila sem sair de casa'}
                        {step === 'success' && 'Você está na fila!'}
                        {step === 'check' && 'Sua posição'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {/* Form Step */}
                {step === 'form' && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seu nome
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Digite seu nome"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone com DDD *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        required
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      />
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Digite o DDD + número (celular ou fixo)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantidade de pessoas
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.max(1, partySize - 1))}
                          className="w-12 h-12 bg-primary-100 text-primary-700 rounded-lg text-xl font-bold hover:bg-primary-200 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-2xl font-bold text-primary-700 w-12 text-center">
                          {partySize}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.min(20, partySize + 1))}
                          className="w-12 h-12 bg-primary-100 text-primary-700 rounded-lg text-xl font-bold hover:bg-primary-200 transition-colors"
                        >
                          +
                        </button>
                        <span className="text-sm text-gray-500 ml-2">
                          {partySize === 1 ? 'pessoa' : 'pessoas'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !name || getPhoneNumbers(phone).length < 10}
                      className={cn(
                        'w-full py-4 rounded-lg font-bold text-white transition-all',
                        'bg-gradient-to-r from-primary-600 to-primary-700',
                        'hover:from-primary-700 hover:to-primary-800',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar na Fila'}
                    </button>

                    {/* Verificar código existente */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">ou</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={checkCode}
                        onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
                        placeholder="Código (ex: ABC123)"
                        maxLength={6}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => handleCheckStatus()}
                        disabled={isLoading || checkCode.length < 6}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
                      >
                        Verificar
                      </button>
                    </div>
                  </form>
                )}

                {/* Success Step */}
                {step === 'success' && queueInfo && (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <div>
                      <p className="text-gray-600 mb-2">Você é o</p>
                      <div className="text-6xl font-bold text-primary-700">
                        #{queueInfo.position}
                      </div>
                      <p className="text-gray-600 mt-2">da fila</p>
                    </div>

                    <div className="bg-primary-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Seu código</p>
                      <div className="text-3xl font-mono font-bold text-primary-700 tracking-widest">
                        {queueInfo.code}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Guarde este código para acompanhar sua posição
                      </p>
                    </div>

                    {queueInfo.peopleAhead > 0 && (
                      <p className="text-gray-600">
                        <span className="font-semibold">{queueInfo.peopleAhead}</span> grupo(s) à sua frente
                        <br />
                        <span className="text-sm">Tempo estimado: ~{queueInfo.peopleAhead * 10} min</span>
                      </p>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={copyLink}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar Link
                      </button>
                      <button
                        onClick={() => handleCheckStatus(queueInfo.code)}
                        className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      >
                        Atualizar Posição
                      </button>
                    </div>
                  </div>
                )}

                {/* Check Status Step */}
                {step === 'check' && statusInfo && (
                  <div className="text-center space-y-6">
                    <div className={cn(
                      'w-20 h-20 rounded-full flex items-center justify-center mx-auto',
                      statusInfo.status === 'WAITING' && 'bg-blue-100',
                      statusInfo.status === 'CALLED' && 'bg-green-100 animate-pulse',
                      statusInfo.status === 'SEATED' && 'bg-gray-100',
                      (statusInfo.status === 'CANCELLED' || statusInfo.status === 'NO_SHOW' || statusInfo.status === 'EXPIRED') && 'bg-red-100'
                    )}>
                      {statusInfo.status === 'WAITING' && (
                        <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {statusInfo.status === 'CALLED' && (
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      )}
                      {statusInfo.status === 'SEATED' && (
                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {(statusInfo.status === 'CANCELLED' || statusInfo.status === 'NO_SHOW' || statusInfo.status === 'EXPIRED') && (
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>

                    {statusInfo.status === 'WAITING' && (
                      <>
                        <div>
                          <p className="text-gray-600 mb-2">Sua posição</p>
                          <div className="text-6xl font-bold text-primary-700">
                            #{statusInfo.position}
                          </div>
                        </div>

                        {statusInfo.peopleAhead > 0 && (
                          <div className="bg-blue-50 rounded-xl p-4">
                            <p className="text-blue-700">
                              <span className="font-semibold">{statusInfo.peopleAhead}</span> grupo(s) à sua frente
                            </p>
                            {statusInfo.estimatedWaitMinutes && (
                              <p className="text-sm text-blue-600 mt-1">
                                Tempo estimado: ~{statusInfo.estimatedWaitMinutes} min
                              </p>
                            )}
                          </div>
                        )}

                        {statusInfo.position === 1 && (
                          <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4">
                            <p className="text-green-700 font-bold text-lg">
                              Você é o próximo!
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                              Aguarde ser chamado
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {statusInfo.status === 'CALLED' && (
                      <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6">
                        <p className="text-2xl font-bold text-green-700 mb-2">
                          🔔 SUA VEZ CHEGOU!
                        </p>
                        <p className="text-green-600">
                          Por favor, dirija-se à recepção
                        </p>
                      </div>
                    )}

                    {statusInfo.status === 'SEATED' && (
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-gray-700 font-medium">
                          Você já foi atendido
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Bom apetite! 🍽️
                        </p>
                        <p className="text-gray-400 text-xs mt-3">
                          Deseja entrar na fila novamente?
                        </p>
                      </div>
                    )}

                    {(statusInfo.status === 'CANCELLED' || statusInfo.status === 'NO_SHOW' || statusInfo.status === 'EXPIRED') && (
                      <div className="bg-red-50 rounded-xl p-4">
                        <p className="text-red-700 font-medium">
                          {statusInfo.message}
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Código</p>
                      <p className="font-mono font-bold text-gray-700">{statusInfo.code}</p>
                    </div>

                    <div className="flex gap-3">
                      {statusInfo.status === 'WAITING' && (
                        <>
                          <button
                            onClick={() => handleCheckStatus(statusInfo.code)}
                            disabled={isLoading}
                            className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                          >
                            {isLoading ? 'Atualizando...' : 'Atualizar'}
                          </button>
                          <button
                            onClick={copyLink}
                            className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </>
                      )}
                      {(statusInfo.status === 'CANCELLED' || statusInfo.status === 'NO_SHOW' || statusInfo.status === 'EXPIRED' || statusInfo.status === 'SEATED') && (
                        <button
                          onClick={handleNewEntry}
                          className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                          Entrar na Fila Novamente
                        </button>
                      )}
                    </div>

                    {/* Mensagem de auto-refresh */}
                    {(statusInfo.status === 'WAITING' || statusInfo.status === 'CALLED') && (
                      <p className="text-xs text-gray-400 text-center mt-3">
                        Atualizando automaticamente a cada 10 segundos
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

