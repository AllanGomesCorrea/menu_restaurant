# Casa do Porco - Painel Administrativo

Painel de gerenciamento para o restaurante Casa do Porco.

## Funcionalidades

- **Dashboard** - Estatísticas de reservas e cardápio
- **Cardápio** - CRUD completo de pratos
- **Reservas** - Gerenciar reservas, confirmar/cancelar, bloquear horários
- **Usuários** - Criar supervisores e administradores (apenas ADMIN)
- **Configurações** - Alterar dados do perfil e senha

## Requisitos

- Node.js 20+
- Backend rodando em http://localhost:3000

## Instalação

```bash
cd admin
npm install
```

## Configuração

```bash
cp .env.example .env
# Edite .env se necessário
```

## Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5174

## Build

```bash
npm run build
```

## Credenciais de Teste

| Role | Email | Senha |
|------|-------|-------|
| ADMIN | admin@casadoporco.com.br | Admin@123 |
| SUPERVISOR | supervisor@casadoporco.com.br | Supervisor@123 |

## Permissões

| Funcionalidade | Supervisor | Admin |
|----------------|------------|-------|
| Ver Dashboard | ✅ | ✅ |
| Ver Cardápio | ✅ | ✅ |
| Editar Cardápio | ✅ | ✅ |
| Criar/Excluir Pratos | ❌ | ✅ |
| Ver Reservas | ✅ | ✅ |
| Confirmar/Cancelar Reservas | ✅ | ✅ |
| Excluir Reservas | ❌ | ✅ |
| Bloquear Horários | ❌ | ✅ |
| Gerenciar Usuários | ❌ | ✅ |

## Tecnologias

- React 19
- TypeScript
- Vite
- TailwindCSS
- React Router
- React Query
- Zustand (estado global)
- Axios
- Lucide Icons
