# ================================
# Base Stage
# ================================
FROM node:20-alpine AS base

WORKDIR /app

# Instala dependências necessárias para o Prisma
RUN apk add --no-cache openssl

# ================================
# Dependencies Stage
# ================================
FROM base AS deps

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Gera o Prisma Client
RUN npx prisma generate

# ================================
# Development Stage
# ================================
FROM base AS development

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Comando para desenvolvimento com hot reload
CMD ["npm", "run", "start:dev"]

# ================================
# Build Stage
# ================================
FROM base AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera o Prisma Client e builda o projeto
RUN npx prisma generate
RUN npm run build

# Remove devDependencies
RUN npm prune --production

# ================================
# Production Stage
# ================================
FROM base AS production

WORKDIR /app

# Copia apenas o necessário para produção
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

# Usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Comando para produção
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]

