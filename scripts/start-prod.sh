#!/bin/bash

# =============================================================================
# Casa do Porco - Script de Inicialização para Produção
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           🐷 Casa do Porco - Ambiente de Produção            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Verifica arquivo .env
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${RED}❌ Arquivo .env não encontrado!${NC}"
    echo -e "${YELLOW}   Crie o arquivo .env baseado no .env.example${NC}"
    exit 1
fi

# Carrega variáveis de ambiente
source "$PROJECT_ROOT/.env"

# Verifica variáveis obrigatórias
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" == "CHANGE_THIS_TO_A_SECURE_SECRET" ]; then
    echo -e "${RED}❌ JWT_SECRET não configurado corretamente!${NC}"
    exit 1
fi

if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
    echo -e "${RED}❌ Credenciais do admin não configuradas!${NC}"
    exit 1
fi

echo -e "${BLUE}🐳 Verificando Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando.${NC}"
    exit 1
fi

echo -e "${BLUE}🏗️  Construindo e iniciando containers...${NC}"
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

echo -e "${BLUE}⏳ Aguardando serviços iniciarem...${NC}"
sleep 10

echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                 ✅ PRODUÇÃO INICIADA                         ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  🚀 Backend API:         http://localhost:3000/api           ║"
echo "║  📚 Swagger Docs:        http://localhost:3000/api/docs      ║"
echo "║                                                              ║"
echo "║  ⚠️  Configure seu proxy reverso (Nginx/Traefik) para        ║"
echo "║     servir o frontend estático e rotear para a API          ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BLUE}📋 Status dos containers:${NC}"
docker compose ps

