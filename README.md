# Idea Research Engine

Base technique pour l'application Idea Research Engine.

## Stack

- Frontend: React, TypeScript, Vite
- Backend: TypeScript, Fastify, Zod, Prisma, PostgreSQL
- Infrastructure: Docker Compose
- Qualite: ESLint, Prettier, TypeScript strict

## Installation

```bash
npm install
cp .env.example .env
docker compose up -d postgres
npm run prisma:generate --workspace backend
```

## Lancement

```bash
npm run dev
```

Frontend: http://localhost:5173

Backend healthcheck: http://localhost:3000/health

## Commandes utiles

```bash
npm run build
npm run lint
npm run typecheck
npm run prisma:db:push --workspace backend
```
