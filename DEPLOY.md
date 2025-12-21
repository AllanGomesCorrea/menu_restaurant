# 🐷 Casa do Porco - Guia de Deploy

Este documento explica como iniciar o sistema em desenvolvimento e produção, como o administrador inicial é criado e os próximos passos para o sistema funcionar perfeitamente.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Desenvolvimento Local](#desenvolvimento-local)
4. [Produção](#produção)
5. [Criação do Administrador](#criação-do-administrador)
6. [Próximos Passos](#próximos-passos)
7. [Comandos Úteis](#comandos-úteis)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O sistema Casa do Porco é composto por 3 aplicações:

| Aplicação | Descrição | Porta (Dev) | Porta (Prod) |
|-----------|-----------|-------------|--------------|
| **Frontend** | Site do cliente | 5173 | 80 |
| **Admin** | Painel administrativo | 5174 | 8080 |
| **Backend** | API NestJS | 3000 | 3000 |

Além do **PostgreSQL** como banco de dados.

---

## ✅ Pré-requisitos

- **Node.js** 18+ (recomendado 20+)
- **Docker** e **Docker Compose**
- **Git**

---

## 💻 Desenvolvimento Local

### Opção 1: Comando Único (Recomendado)

```bash
# Inicia tudo de uma vez: banco, backend, frontend e admin
npm run dev:all
```

Este comando:
1. Verifica se o Docker está rodando
2. Inicia o PostgreSQL via Docker
3. Instala dependências (se necessário)
4. Roda as migrações do banco
5. Inicia os 3 serviços em paralelo

**URLs disponíveis:**
- 🌐 Frontend: http://localhost:5173
- 🔧 Admin: http://localhost:5174
- 🚀 API: http://localhost:3000/api
- 📚 Swagger: http://localhost:3000/api/docs

### Opção 2: Iniciar Serviços Separadamente

```bash
# Terminal 1 - Banco de dados
npm run db:up

# Terminal 2 - Backend
npm run dev:backend

# Terminal 3 - Frontend
npm run dev

# Terminal 4 - Admin
npm run dev:admin
```

### Parar Todos os Serviços

```bash
npm run stop
```

---

## 🚀 Produção

### Passo 1: Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas configurações
nano .env
```

**⚠️ Variáveis OBRIGATÓRIAS para produção:**

```env
# Gere uma chave segura: openssl rand -base64 64
JWT_SECRET=sua-chave-super-secreta-aqui

# Credenciais do admin inicial
ADMIN_EMAIL=admin@seudominio.com.br
ADMIN_PASSWORD=SenhaForte@123

# Ambiente
NODE_ENV=production
```

### Passo 2: Iniciar em Produção

```bash
npm run start:prod
```

Ou manualmente com Docker Compose:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Passo 3: Configurar Proxy Reverso

Para produção, configure um proxy reverso (Nginx, Traefik, etc.) para:
- Servir o frontend no domínio principal
- Servir o admin em um subdomínio (ex: admin.seusite.com)
- Rotear `/api` para o backend

**Exemplo Nginx:**

```nginx
# Frontend
server {
    listen 80;
    server_name casadoporco.com.br;
    
    location / {
        proxy_pass http://localhost:80;
    }
}

# Admin
server {
    listen 80;
    server_name admin.casadoporco.com.br;
    
    location / {
        proxy_pass http://localhost:8080;
    }
}

# API (se separado)
server {
    listen 80;
    server_name api.casadoporco.com.br;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

---

## 👤 Criação do Administrador

### Como Funciona

O **primeiro administrador é criado automaticamente** quando o backend inicia, usando as variáveis de ambiente:

| Variável | Descrição | Padrão (Dev) |
|----------|-----------|--------------|
| `ADMIN_EMAIL` | E-mail do admin | admin@casadoporco.com.br |
| `ADMIN_PASSWORD` | Senha do admin | Admin@123 |
| `ADMIN_NAME` | Nome do admin | Administrador |

### Processo Automático

1. Ao iniciar, o backend verifica se existe algum usuário com o e-mail configurado
2. Se **não existir**, cria o usuário automaticamente com role `ADMIN`
3. Se **já existir**, não faz nada (preserva o usuário existente)

### Para Novos Clientes

Para cada novo cliente/instalação:

1. Configure as variáveis `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_NAME` no `.env`
2. Inicie o sistema - o admin será criado automaticamente
3. Faça login no painel admin e **altere a senha imediatamente**
4. Crie usuários adicionais (admins ou supervisores) conforme necessário

### Diferença entre Roles

| Role | Permissões |
|------|------------|
| **ADMIN** | CRUD completo (criar, ler, atualizar, deletar) em todos os recursos |
| **SUPERVISOR** | Apenas ler e atualizar (sem criar ou deletar) |

---

## 📝 Próximos Passos

Após a instalação, siga estes passos para o sistema funcionar perfeitamente:

### 1. Alterar Senha do Admin

```
1. Acesse http://localhost:5174 (ou seu domínio admin)
2. Faça login com as credenciais configuradas
3. Vá em Configurações → Alterar Senha
4. Defina uma nova senha segura
```

### 2. Cadastrar o Cardápio

```
1. Acesse o painel Admin
2. Vá em Cardápio → Novo Item
3. Adicione cada prato com:
   - Nome, descrição, preço
   - Categoria (Entradas, Pratos, Sobremesas, Bebidas)
   - Imagem (opcional, URL)
   - Marque como Destaque se desejar
```

### 3. Criar Usuários Adicionais (Opcional)

```
1. Vá em Usuários → Novo Usuário
2. Defina nome, e-mail, senha e role
3. Compartilhe as credenciais com a equipe
```

### 4. Configurar Horários Bloqueados (Opcional)

```
1. Vá em Reservas → Bloquear Dia
2. Selecione a data e motivo
3. O sistema não permitirá reservas neste dia
```

### 5. Configurar EmailJS (Para Confirmações)

Se quiser enviar e-mails de confirmação de reserva, configure o EmailJS no arquivo `src/config/emailjs.ts`.

---

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Iniciar tudo
npm run dev:all

# Parar tudo
npm run stop

# Apenas banco de dados
npm run db:up
npm run db:down

# Visualizar banco (Prisma Studio)
npm run db:studio

# Rodar migrações
npm run db:migrate
```

### Produção

```bash
# Build de tudo
npm run build:all

# Iniciar produção
npm run start:prod

# Ver logs dos containers
docker compose logs -f

# Ver status dos containers
docker compose ps

# Reiniciar containers
docker compose restart
```

### Backend

```bash
cd backend

# Gerar Prisma Client
npx prisma generate

# Criar nova migração
npx prisma migrate dev --name nome_da_migracao

# Aplicar migrações (produção)
npx prisma migrate deploy

# Reset do banco (CUIDADO!)
npx prisma migrate reset --force
```

---

## 🔧 Troubleshooting

### Erro: "Docker não está rodando"

```bash
# macOS
open -a Docker

# Linux
sudo systemctl start docker
```

### Erro: "Porta já em uso"

```bash
# Parar processos nas portas
npm run stop

# Ou manualmente
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
lsof -ti:5174 | xargs kill -9
```

### Erro: "Banco não conecta"

```bash
# Verificar se o container está rodando
docker compose ps

# Ver logs do PostgreSQL
docker compose logs postgres

# Reiniciar container
docker compose restart postgres
```

### Erro: "Admin não foi criado"

1. Verifique se as variáveis `ADMIN_EMAIL` e `ADMIN_PASSWORD` estão no `.env`
2. Verifique os logs do backend:
   ```bash
   docker compose logs backend
   ```
3. Procure por: "Admin inicial criado com sucesso" ou "Admin inicial já existe"

### Limpar Tudo e Recomeçar

```bash
# Para tudo
npm run stop
docker compose down -v  # -v remove os volumes (DADOS!)

# Remove node_modules
rm -rf node_modules backend/node_modules admin/node_modules

# Reinstala
npm install
cd backend && npm install
cd ../admin && npm install
cd ..

# Inicia novamente
npm run dev:all
```

---

## 📊 Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Proxy Reverso    │
                    │  (Nginx/Traefik)   │
                    └─────────┬─────────┘
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   Frontend      │ │   Admin Panel   │ │   Backend API   │
│   (React)       │ │   (React)       │ │   (NestJS)      │
│   :80           │ │   :8080         │ │   :3000         │
└─────────────────┘ └─────────────────┘ └────────┬────────┘
                                                  │
                                         ┌────────┴────────┐
                                         │   PostgreSQL    │
                                         │   :5432         │
                                         └─────────────────┘
```

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique este guia de troubleshooting
2. Consulte os logs: `docker compose logs -f`
3. Verifique a documentação da API: http://localhost:3000/api/docs

---

*Última atualização: Dezembro 2024*

