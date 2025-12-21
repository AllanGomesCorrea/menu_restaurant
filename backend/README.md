# Casa do Porco - Backend API

Backend em NestJS para o sistema de gestão de cardápio e reservas do restaurante Casa do Porco.

## Tecnologias

- **NestJS 10** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL 16** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Docker** - Containerização

## Requisitos

- Node.js 20+
- Docker e Docker Compose
- npm ou yarn

## Início Rápido

### 1. Subir o banco de dados

```bash
# Na raiz do projeto (pasta Casa do porco)
docker-compose up -d postgres pgadmin --profile dev
```

### 2. Configurar ambiente

```bash
cd backend
cp .env.example .env
# Edite o .env se necessário
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Gerar cliente Prisma e rodar migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Popular banco com dados iniciais

```bash
npm run prisma:seed
```

### 6. Iniciar em desenvolvimento

```bash
npm run start:dev
```

A API estará disponível em: http://localhost:3000

## URLs Importantes

- **API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api/docs
- **pgAdmin**: http://localhost:5050 (admin@casadoporco.com.br / admin123)

## Criação Automática de Admin

O sistema cria automaticamente o primeiro administrador na inicialização se:
1. As variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD` estiverem configuradas
2. Não existir nenhum usuário ADMIN no banco

```env
# .env - Variáveis para criação automática do admin
ADMIN_NAME=João Silva
ADMIN_EMAIL=joao@restaurante.com
ADMIN_PASSWORD=SenhaSegura123!
```

Isso elimina a necessidade de rodar seeds manuais em novos deploys.

## Usuários Padrão (Seed - Desenvolvimento)

| Role | Email | Senha |
|------|-------|-------|
| ADMIN | admin@casadoporco.com.br | Admin@123 |
| SUPERVISOR | supervisor@casadoporco.com.br | Supervisor@123 |

## Permissões

| Ação | Supervisor | Admin |
|------|------------|-------|
| GET (listar/visualizar) | ✅ | ✅ |
| PUT/PATCH (editar) | ✅ | ✅ |
| POST (criar) | ❌ | ✅ |
| DELETE (remover) | ❌ | ✅ |

## Endpoints Principais

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registrar (Admin only)
- `GET /api/auth/profile` - Perfil do usuário

### Menu (Cardápio)
- `GET /api/menu` - Listar todos (público)
- `GET /api/menu/by-category` - Por categoria (público)
- `GET /api/menu/featured` - Destaques (público)
- `POST /api/menu` - Criar (Admin)
- `PUT /api/menu/:id` - Atualizar (Supervisor/Admin)
- `DELETE /api/menu/:id` - Remover (Admin)

### Bookings (Reservas)
- `GET /api/bookings/availability?date=YYYY-MM-DD` - Verificar disponibilidade (público)
- `POST /api/bookings` - Criar reserva (público)
- `GET /api/bookings` - Listar (autenticado)
- `PUT /api/bookings/:id` - Atualizar (Supervisor/Admin)
- `PATCH /api/bookings/:id/status` - Alterar status (Supervisor/Admin)
- `DELETE /api/bookings/:id` - Remover (Admin)

### Blocked Slots (Horários Bloqueados)
- `GET /api/blocked-slots` - Listar (autenticado)
- `POST /api/blocked-slots` - Bloquear (Admin)
- `POST /api/blocked-slots/block-day` - Bloquear dia inteiro (Admin)
- `DELETE /api/blocked-slots/:id` - Desbloquear (Admin)

## Comandos Úteis

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Produção
npm run start:prod

# Prisma
npm run prisma:generate   # Gerar cliente
npm run prisma:migrate    # Executar migrations
npm run prisma:studio     # Interface visual do banco
npm run prisma:seed       # Popular banco

# Reset do banco
npm run db:reset
```

## Docker (Produção)

```bash
# Build e iniciar todos os serviços
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Apenas backend
docker-compose up -d backend --profile prod
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── auth/              # Autenticação JWT
│   ├── users/             # Gestão de usuários
│   ├── menu/              # CRUD cardápio
│   ├── bookings/          # CRUD reservas
│   ├── blocked-slots/     # Horários bloqueados
│   ├── health/            # Health check
│   ├── common/            # Guards, decorators
│   ├── prisma/            # Prisma service
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   └── seed.ts            # Dados iniciais
├── Dockerfile
└── package.json
```

## Variáveis de Ambiente

| Variável | Descrição | Default |
|----------|-----------|---------|
| DATABASE_URL | URL do PostgreSQL | - |
| JWT_SECRET | Chave secreta do JWT | - |
| JWT_EXPIRES_IN | Expiração do token | 7d |
| PORT | Porta da API | 3000 |
| NODE_ENV | Ambiente | development |
| ADMIN_EMAIL | Email do admin (seed) | admin@casadoporco.com.br |
| ADMIN_PASSWORD | Senha do admin (seed) | Admin@123 |
| ADMIN_NAME | Nome do admin (seed) | Administrador |

