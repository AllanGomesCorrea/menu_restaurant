#!/bin/bash

# =============================================================================
# Casa do Porco - Script de Inicialização para Desenvolvimento
# =============================================================================

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🐷 Casa do Porco - Ambiente de Desenvolvimento     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Diretório raiz do projeto
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Função para verificar se uma porta está em uso
check_port() {
    if lsof -i:$1 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Função para matar processos em uma porta
kill_port() {
    if check_port $1; then
        echo -e "${YELLOW}⚠️  Porta $1 em uso. Liberando...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Verifica se o Docker está rodando
echo -e "${BLUE}🐳 Verificando Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando. Por favor, inicie o Docker primeiro.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker está rodando${NC}"

# Libera portas se necessário
echo -e "${BLUE}🔌 Verificando portas...${NC}"
kill_port 3000  # Backend
kill_port 5173  # Frontend
kill_port 5174  # Admin

# Inicia o banco de dados
echo -e "${BLUE}🗄️  Iniciando PostgreSQL...${NC}"
docker compose up -d postgres
echo -e "${GREEN}✅ PostgreSQL iniciado${NC}"

# Aguarda o banco estar pronto
echo -e "${BLUE}⏳ Aguardando PostgreSQL ficar pronto...${NC}"
sleep 3

# Verifica se as dependências estão instaladas
echo -e "${BLUE}📦 Verificando dependências...${NC}"

if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo -e "${YELLOW}📥 Instalando dependências do Frontend...${NC}"
    npm install
fi

if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
    echo -e "${YELLOW}📥 Instalando dependências do Backend...${NC}"
    cd "$PROJECT_ROOT/backend" && npm install
    cd "$PROJECT_ROOT"
fi

if [ ! -d "$PROJECT_ROOT/admin/node_modules" ]; then
    echo -e "${YELLOW}📥 Instalando dependências do Admin...${NC}"
    cd "$PROJECT_ROOT/admin" && npm install
    cd "$PROJECT_ROOT"
fi

# Gera o Prisma Client e roda as migrações
echo -e "${BLUE}🔧 Configurando banco de dados...${NC}"
cd "$PROJECT_ROOT/backend"
npx prisma generate
npx prisma migrate deploy 2>/dev/null || npx prisma migrate dev --name init
cd "$PROJECT_ROOT"
echo -e "${GREEN}✅ Banco de dados configurado${NC}"

# Inicia os serviços em background
echo -e "${BLUE}🚀 Iniciando serviços...${NC}"

# Backend
echo -e "${YELLOW}   → Iniciando Backend (porta 3000)...${NC}"
cd "$PROJECT_ROOT/backend" && npm run start:dev > /dev/null 2>&1 &
BACKEND_PID=$!

# Frontend
echo -e "${YELLOW}   → Iniciando Frontend (porta 5173)...${NC}"
cd "$PROJECT_ROOT" && npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!

# Admin
echo -e "${YELLOW}   → Iniciando Admin (porta 5174)...${NC}"
cd "$PROJECT_ROOT/admin" && npm run dev > /dev/null 2>&1 &
ADMIN_PID=$!

# Aguarda os serviços iniciarem
echo -e "${BLUE}⏳ Aguardando serviços iniciarem...${NC}"
sleep 5

# Exibe informações
echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    ✅ SISTEMA INICIADO                       ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  🌐 Frontend (Cliente):  http://localhost:5173               ║"
echo "║  🔧 Admin Panel:         http://localhost:5174               ║"
echo "║  🚀 Backend API:         http://localhost:3000/api           ║"
echo "║  📚 Swagger Docs:        http://localhost:3000/api/docs      ║"
echo "║  🗄️  pgAdmin:             http://localhost:5050 (opcional)   ║"
echo "║                                                              ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  📧 Admin Login:         admin@casadoporco.com.br            ║"
echo "║  🔑 Admin Senha:         Admin@123                           ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  Para parar: Ctrl+C ou execute ./scripts/stop-dev.sh        ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Salva os PIDs para poder parar depois
echo "$BACKEND_PID $FRONTEND_PID $ADMIN_PID" > "$PROJECT_ROOT/.dev-pids"

# Mantém o script rodando e mostra logs
echo -e "${BLUE}📋 Logs do Backend:${NC}"
cd "$PROJECT_ROOT/backend"
tail -f /dev/null &

# Captura Ctrl+C para limpar
trap 'echo -e "\n${YELLOW}🛑 Parando serviços...${NC}"; kill $BACKEND_PID $FRONTEND_PID $ADMIN_PID 2>/dev/null; docker compose stop postgres; echo -e "${GREEN}✅ Serviços parados${NC}"; exit 0' INT

# Mantém o script vivo
wait

