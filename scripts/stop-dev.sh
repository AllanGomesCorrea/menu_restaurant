#!/bin/bash

# =============================================================================
# Casa do Porco - Script para Parar Desenvolvimento
# =============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo -e "${YELLOW}🛑 Parando todos os serviços...${NC}"

# Para processos node nas portas específicas
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:5174 | xargs kill -9 2>/dev/null || true

# Para containers Docker
cd "$PROJECT_ROOT"
docker compose stop 2>/dev/null || true

# Remove arquivo de PIDs
rm -f "$PROJECT_ROOT/.dev-pids"

echo -e "${GREEN}✅ Todos os serviços foram parados${NC}"

