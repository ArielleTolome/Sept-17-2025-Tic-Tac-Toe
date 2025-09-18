# Nebula Tic-Tac-Toe

A production-ready, full-stack Tic-Tac-Toe platform with single-player AI, local multiplayer, and real-time online matches. The project ships as a pnpm-powered monorepo covering web, API, shared packages, DevOps automation, and an accessibility-first UI.

## Highlights

- ♟️ **Three play modes** – deterministic AI with multiple difficulties, pass-and-play, and WebSocket-backed online rooms with chat, presence, and rematches.
- 🧠 **Shared TypeScript core** – game logic, schemas, and minimax AI exposed from `packages/shared` and reused everywhere.
- ⚙️ **Robust backend** – Express, Prisma, JWT-authenticated sockets, rate limiting, structured logging, and OpenAPI documentation.
- 🎨 **Polished React UI** – Vite, Tailwind, Headless UI, Zustand, and i18n-ready strings with keyboard-first interactions and accessibility baked in.
- ✅ **Quality gates** – Vitest unit tests, Supertest API checks, Playwright end-to-end coverage, Husky pre-commit hooks, and CI workflow.
- 🐳 **Deployment-ready** – Multi-stage Dockerfiles, docker-compose stack (API, web, Postgres), and GitHub Actions pipeline.

## Architecture

```
                   ┌───────────────────────────┐
                   │        apps/web (Vite)    │
                   │ React UI  │ Zustand       │
                   │ Tailwind  │ Playwright    │
                   └───────────┴──────┬────────┘
                                      │ REST + WS
┌─────────────┐   shared types/AI   ┌──▼────────────────────────┐
│ packages/   │<───────────────────>│    apps/api (Express)     │
│ shared      │                     │ Prisma │ Socket.IO        │
│ Zod schemas │                     │ JWT    │ OpenAPI          │
└─────┬───────┘                     └──┬──────────┬─────────────┘
      │                               │          │
      │                               │          │
      │                         REST/WS│          │Prisma
      │                               │          │
      │                               ▼          ▼
      │                         ┌───────────┐ ┌───────────┐
      │                         │ Frontend  │ │ Postgres  │
      │                         │ Consumers │ │ / SQLite  │
      │                         └───────────┘ └───────────┘
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 8 (`corepack enable` will set it up)
- (Optional) Docker + Docker Compose

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The command launches both the API (http://localhost:4000) and web client (http://localhost:5173) with live reload. The API reads environment variables from `apps/api/.env` if present; copy `.env.example` to get started.

### Database

- **Development (default):** SQLite file at `apps/api/prisma/dev.db`.
- **Production/Docker:** PostgreSQL. Update `PRISMA_DB_PROVIDER=postgresql` and provide `DATABASE_URL`.

Run migrations:

```bash
pnpm --filter @tic-tac-toe/api prisma:migrate
```

Generate Prisma client:

```bash
pnpm --filter @tic-tac-toe/api prisma:generate
```

## Environment Variables

| Scope | Variable | Default | Description |
|-------|----------|---------|-------------|
| API | `DATABASE_URL` | `file:./prisma/dev.db` | Prisma connection string |
| API | `PRISMA_DB_PROVIDER` | `sqlite` | `sqlite` or `postgresql` |
| API | `WS_JWT_SECRET` | `change-me` | Secret for socket JWTs |
| API | `JWT_ISSUER` | `tic-tac-toe` | JWT issuer string |
| API | `FRONTEND_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| API | `PUBLIC_WS_URL` | `http://localhost:4000` | Public WebSocket base URL |
| API | `TURN_TIMEOUT_SECONDS` | `10` | Multiplayer turn timer |
| Web | `VITE_API_BASE_URL` | `http://localhost:4000` | REST base URL |
| Web | `VITE_WS_URL` | `http://localhost:4000` | WebSocket server URL |

Use `.env.example` files in the root, `apps/api/`, and `apps/web/` as templates.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run API + web concurrently |
| `pnpm build` | Build all workspaces |
| `pnpm test` | Run unit tests across packages |
| `pnpm e2e` | Run Playwright end-to-end suite |
| `pnpm lint` | Lint all workspaces |
| `pnpm typecheck` | Type-check all workspaces |
| `pnpm --filter @tic-tac-toe/api prisma:migrate` | Create or apply Prisma migrations |

## Testing

- **Unit:** `pnpm test`
- **API:** Supertest specs under `apps/api/tests`
- **Shared:** Vitest coverage ≥ 90%
- **Web:** Vitest store/component tests (jsdom)
- **E2E:** `pnpm e2e` spins up the stack and runs Playwright flows for single, local, and multiplayer modes.

Playwright can reuse an existing dev server by exporting `PLAYWRIGHT_SKIP_SERVER=1`.

## Docker & Compose

Build images individually:

```bash
# API
docker build -t tic-tac-toe-api -f apps/api/Dockerfile .
# Web
docker build -t tic-tac-toe-web -f apps/web/Dockerfile .
```

Run the full stack (web, API, Postgres):

```bash
docker compose up --build
```

The web UI is served on http://localhost:5173 and the API on http://localhost:4000.

## Continuous Integration

`.github/workflows/ci.yml` runs lint, typecheck, build, unit tests, and Playwright end-to-end tests on push and pull requests.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Prisma cannot connect | Verify `DATABASE_URL` and ensure the Postgres container is healthy. |
| WebSocket auth failures | Regenerate `WS_JWT_SECRET` and restart API/web to refresh tokens. |
| Playwright hangs in CI | Set `PLAYWRIGHT_SKIP_SERVER=1` to reuse an already running dev server. |
| ESLint/Prettier mismatch | Run `pnpm format` and `pnpm lint --fix` to auto-resolve. |

## License

MIT © 2025 Nebula Tic-Tac-Toe team
