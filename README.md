# Clone A Casa do Porco - Projeto Educacional

Clone educacional do site [A Casa do Porco](https://acasadoporco.com.br/) desenvolvido com React 18, TypeScript, Tailwind CSS e Framer Motion.

> ⚠️ **Nota**: Este é um projeto educacional para fins de estudo. Não é um site oficial e não será publicado.

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Type safety e melhor DX
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS v3** - Framework CSS utility-first
- **Framer Motion** - Biblioteca de animações
- **React Router** - Navegação entre páginas
- **EmailJS** - Envio de emails de confirmação
- **date-fns** - Manipulação de datas
- **ESLint & Prettier** - Code quality e formatação

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Card)
│   └── layout/         # Header, Footer
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks
├── types/              # TypeScript types
├── utils/              # Funções utilitárias
├── data/               # Dados estáticos
└── styles/             # Estilos globais
```

## 🎨 Boas Práticas Implementadas

### 1. **Component Composition**
Componentes pequenos, focados e reutilizáveis seguindo Atomic Design.

### 2. **TypeScript 100%**
Todo o código tipado para prevenção de bugs e melhor developer experience.

### 3. **Custom Hooks**
Lógica reutilizável extraída em hooks customizados:
- `useToggle` - Gerenciamento de estado booleano
- `useMediaQuery` - Detecção de breakpoints
- `useScrollToTop` - Scroll suave

### 4. **Accessibility First**
- Semântica HTML adequada
- ARIA labels
- Navegação por teclado
- Screen reader friendly

### 5. **Performance**
- Code splitting com React.lazy
- Lazy loading de componentes
- Image optimization
- Bundle size optimization

### 6. **Animações**
Animações suaves e profissionais com Framer Motion:
- Scroll-triggered animations
- Staggered children
- Hover effects
- Page transitions

## 🛠️ Comandos

### Desenvolvimento
```bash
npm run dev
```
Inicia o servidor de desenvolvimento em `http://localhost:5173/`

### Build
```bash
npm run build
```
Cria build otimizado para produção na pasta `dist/`

### Preview
```bash
npm run preview
```
Preview do build de produção

### Lint
```bash
npm run lint
```
Executa ESLint para verificar qualidade do código

## 📧 Configuração de Email (EmailJS)

O sistema de reservas envia emails de confirmação automaticamente usando EmailJS.

### Configurar:

1. **Copie o arquivo de exemplo:**
```bash
cp env.local.example .env.local
```

2. **Obtenha suas credenciais:**
   - Acesse: https://www.emailjs.com/
   - Crie uma conta gratuita (200 emails/mês)
   - Configure um serviço de email (Gmail, Outlook, etc.)
   - Crie um template de email

3. **Preencha o `.env.local`:**
```env
VITE_EMAILJS_SERVICE_ID=seu_service_id
VITE_EMAILJS_TEMPLATE_ID=seu_template_id
VITE_EMAILJS_PUBLIC_KEY=sua_public_key
```

4. **Guia completo:**
   - Veja: [CONFIGURACAO_EMAILJS.md](./CONFIGURACAO_EMAILJS.md)

## 📦 Versões dos Componentes

### Padrão (sem animações)
- `HomePage` - Página principal
- `HeroSection` - Seção hero
- `InfoList` - Lista de informações

### Animadas (com Framer Motion)
- `HomePageAnimated` - Página principal animada
- `HeroSectionAnimated` - Hero section animada
- `InfoListAnimated` - Lista animada

### Otimizada
- `App.optimized.tsx` - Versão com code splitting e lazy loading

## 🎯 Conceitos Modernos Aplicados

1. **Concurrent Features** (React 18)
   - Automatic batching
   - Transitions
   - Suspense boundaries

2. **TypeScript Avançado**
   - Generic types
   - Union types
   - Type inference
   - Interface composition

3. **CSS Moderno**
   - CSS Grid & Flexbox
   - CSS Variables
   - Tailwind CSS utilities
   - Mobile-first approach

4. **Animações Performáticas**
   - Hardware-accelerated animations
   - RequestAnimationFrame
   - Intersection Observer
   - Will-change property

5. **Code Splitting**
   - Dynamic imports
   - Route-based splitting
   - Component-based splitting

## 📱 Responsividade

Design totalmente responsivo com breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: ≥ 1024px

## 🔍 SEO e Acessibilidade

- Meta tags otimizadas
- Semantic HTML
- ARIA attributes
- Alt text em imagens
- Contrast ratio adequado
- Keyboard navigation

## 🚀 Performance Checklist

- [x] Code splitting implementado
- [x] Lazy loading de componentes
- [x] Images otimizadas
- [x] CSS minificado
- [x] JavaScript minificado
- [x] Tree shaking
- [x] Gzip compression (servidor)
- [x] Lighthouse score 90+

## 📚 Recursos de Aprendizado

### React
- [React Docs](https://react.dev/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com/)

### Framer Motion
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Motion Examples](https://www.framer.com/motion/examples/)

## 📄 Licença

Este é um projeto educacional para fins de estudo. Todos os direitos do design original pertencem a A Casa do Porco.

## 👨‍💻 Desenvolvimento

Desenvolvido como projeto de estudo para demonstração de:
- Arquitetura de componentes React
- TypeScript avançado
- Design system com Tailwind
- Animações com Framer Motion
- Performance optimization
- Accessibility best practices

---

**Nota**: Este projeto não tem afiliação com A Casa do Porco e foi criado apenas para fins educacionais.
