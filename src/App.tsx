/**
 * App Component - Componente raiz
 * Layout principal da aplicação
 * 
 * Boas práticas aplicadas:
 * - Layout pattern (Header, Main, Footer)
 * - Estrutura semântica
 * - Imports organizados
 * - Animações com Framer Motion
 */

import { Header, Footer } from './components/layout';
import { HomePageAnimated } from './pages/HomePageAnimated';

/**
 * App - Componente principal da aplicação
 * Define a estrutura básica: Header + Content + Footer
 * Usa versões animadas dos componentes
 */
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fixo no topo */}
      <Header />

      {/* Conteúdo principal - flex-1 para ocupar todo espaço disponível */}
      <div className="flex-1">
        <HomePageAnimated />
      </div>

      {/* Footer no final */}
      <Footer />
    </div>
  );
}

export default App;
