# 🚀 Início Rápido - Clone Casa do Porco

## ⚡ Comandos Essenciais

### 1. Instalar Dependências (se necessário)
```bash
cd "/Users/allan/Documents/Projetos/Casa do porco/casa-do-porco-clone"
npm install
```

### 2. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
✅ Acesse: **http://localhost:5173/**

### 3. Build para Produção
```bash
npm run build
```
✅ Arquivos gerados em: `dist/`

### 4. Preview do Build
```bash
npm run preview
```
✅ Acesse: **http://localhost:4173/**

---

## 📂 Estrutura Rápida

```
src/
├── components/      # Componentes reutilizáveis
├── pages/          # Páginas (HomePageAnimated)
├── hooks/          # Custom hooks
├── types/          # TypeScript types
├── data/           # Conteúdo estático
└── utils/          # Utilities
```

---

## 🎨 Componentes Principais

### Versão Animada (Atual) ✅
- `App.optimized.tsx` - App com code splitting
- `HomePageAnimated.tsx` - Página com animações
- `HeroSectionAnimated.tsx` - Hero animado
- `InfoListAnimated.tsx` - Lista animada

### Versão Padrão (Alternativa)
- `App.tsx` - App padrão
- `HomePage.tsx` - Página sem animações
- `HeroSection.tsx` - Hero simples
- `InfoList.tsx` - Lista simples

**Para trocar:** Edite `src/main.tsx` linha 6

---

## 🛠️ Tecnologias

- **React 18.3.1** - UI library
- **TypeScript 5.6.2** - Type safety
- **Vite 7.2.7** - Build tool
- **Tailwind CSS 3.4.17** - Styling
- **Framer Motion 11.15.0** - Animations

---

## 📱 Responsividade

- 📱 Mobile: < 768px
- 📱 Tablet: 768px - 1023px
- 💻 Desktop: ≥ 1024px

---

## ✨ Features

✅ Navigation responsiva com menu mobile
✅ Animações suaves com Framer Motion
✅ Code splitting e lazy loading
✅ Error boundaries
✅ TypeScript 100%
✅ Design system completo
✅ Acessibilidade (ARIA)

---

## 📚 Documentação

- `README.md` - Documentação completa
- `GUIA_IMPLEMENTACAO.md` - Guia passo a passo
- `RESUMO_PROJETO.md` - Resumo técnico
- `INICIO_RAPIDO.md` - Este arquivo

---

## 🎯 Dicas Rápidas

### Alterar Cores
Edite `tailwind.config.js`:
```javascript
colors: {
  primary: { ... },
  accent: { ... }
}
```

### Adicionar Componente
```bash
# Criar em src/components/
# Exportar em src/components/index.ts
```

### Modificar Conteúdo
Edite `src/data/content.ts`

### Debug
```bash
npm run type-check  # Verificar tipos
npm run lint        # Verificar código
```

---

## 🐛 Solução de Problemas

### Porta já em uso
```bash
# Matar processo na porta 5173
lsof -ti:5173 | xargs kill -9
```

### Limpar cache
```bash
rm -rf node_modules dist .vite
npm install
```

### Erro de build
```bash
npm run type-check  # Ver erros TypeScript
```

---

## 📊 Performance

Build otimizado:
- CSS: ~5 kB gzipped
- JS: ~105 kB gzipped
- **Total: ~110 kB** ⚡

---

## 🎓 Para Estudar

1. Leia os comentários no código
2. Analise a estrutura de pastas
3. Veja os custom hooks em `src/hooks/`
4. Estude as animações em componentes `*Animated.tsx`
5. Entenda o code splitting em `App.optimized.tsx`

---

## 🔗 Links Úteis

- [React Docs](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Vite](https://vitejs.dev/)

---

## ✅ Checklist de Verificação

Antes de usar, confirme:
- [ ] Node.js instalado (v20.19+ ou v22.12+)
- [ ] npm funcionando
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Acessível em http://localhost:5173/

---

## 📞 Suporte

Este é um projeto educacional.

Para dúvidas:
1. Consulte a documentação
2. Revise os comentários no código
3. Veja os exemplos implementados

---

**🎉 Projeto 100% Funcional e Pronto para Uso!**

*Desenvolvido com ❤️ para fins educacionais*



