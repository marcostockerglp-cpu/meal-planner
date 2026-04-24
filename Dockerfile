# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

RUN npm ci --workspace=apps/api

COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json ./apps/api/

RUN npm run build -w apps/api

# Stage 2 — Production
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

RUN npm ci --workspace=apps/api --omit=dev

COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api

EXPOSE 8790

CMD ["node", "dist/index.js"]
