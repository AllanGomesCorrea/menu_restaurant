/**
 * App Component - Versão Otimizada
 * Layout principal com code splitting e lazy loading
 * 
 * Otimizações aplicadas:
 * - React.lazy para code splitting
 * - Suspense para loading states
 * - Lazy loading de componentes
 * - Performance optimizations
 */

import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/layout';

// Lazy loading das páginas para code splitting
// Isso cria bundles separados que só são carregados quando necessário
const HomePageAnimated = React.lazy(() =>
  import('./pages/HomePageAnimated').then((module) => ({
    default: module.HomePageAnimated,
  }))
);

const MenuPageAnimated = React.lazy(() =>
  import('./pages/MenuPageAnimated').then((module) => ({
    default: module.MenuPageAnimated,
  }))
);

const BookingPage = React.lazy(() =>
  import('./pages/BookingPage').then((module) => ({
    default: module.BookingPage,
  }))
);

const QueueStatusPage = React.lazy(() =>
  import('./pages/QueueStatusPage').then((module) => ({
    default: module.QueueStatusPage,
  }))
);

/**
 * Loading Component - Fallback para Suspense
 * Exibido enquanto os componentes lazy estão carregando
 */
const LoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex items-center justify-center bg-primary-50">
    <div className="text-center">
      {/* Spinner animado */}
      <div className="inline-block w-16 h-16 border-4 border-primary-200 border-t-primary-700 rounded-full animate-spin mb-4" />
      <p className="text-primary-700 text-lg font-medium">Carregando...</p>
    </div>
  </div>
);

/**
 * Error Boundary - Captura erros de rendering
 * Boa prática: sempre usar Error Boundaries com Suspense
 */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50">
          <div className="text-center max-w-md mx-auto p-8">
            <h1 className="text-3xl font-display font-bold text-primary-900 mb-4">
              Oops! Algo deu errado
            </h1>
            <p className="text-primary-700 mb-6">
              Desculpe, houve um erro ao carregar a página. Por favor, tente
              recarregar.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * App Otimizado - Componente principal
 * Usa React Router, code splitting e lazy loading para melhor performance
 */
function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        {/* Header - carregado no bundle principal por ser crítico */}
        <Header />

        {/* Conteúdo principal com rotas e lazy loading */}
        <div className="flex-1">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Rota principal */}
              <Route path="/" element={<HomePageAnimated />} />
              
              {/* Rota do cardápio */}
              <Route path="/cardapio" element={<MenuPageAnimated />} />
              
              {/* Rota de reservas */}
              <Route path="/reservas" element={<BookingPage />} />
              
              {/* Rota da fila digital - status por código */}
              <Route path="/fila/:code" element={<QueueStatusPage />} />
              
              {/* Rota 404 - Redireciona para home */}
              <Route path="*" element={<HomePageAnimated />} />
            </Routes>
          </Suspense>
        </div>

        {/* Footer - carregado no bundle principal */}
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;



