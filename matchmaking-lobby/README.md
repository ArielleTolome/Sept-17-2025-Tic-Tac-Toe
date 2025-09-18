# Matchmaking Queue & Lobby (Sidecar)

Anonymous lobby where players click “Find Match” to be queued and paired using a lightweight ELO. When paired, the service creates a room via the core API and returns the join link via WebSocket.

## Features

- WS lobby: client↔server for find/cancel and matched notifications
- ELO pairing (SQLite, path via `DB_PATH`) with sensible defaults
- Room creation via `POST /api/rooms` (mockable)
- Reconnect/cancel handling and timeouts (basic)
- Adminless single‑page lobby UI
- Security: Helmet, CORS, rate limits, Zod validation
- Observability: Pino logs with request IDs; `/healthz`

## Quickstart

1. Copy `.env.example` → `.env`.
2. Install deps: `npm ci`
3. Build + serve: `npm run build && PORT=4100 npm run serve`
4. Open `http://localhost:4100` and click Find Match in two browser windows.

Docker:

```bash
docker compose up --build
# Open http://localhost:4100
```

## Env Vars

- `API_BASE_URL` — core API base
- `PORT` — server port (default 4100)
- `ALLOWED_ORIGIN` — allowed origin for API CORS
- `DB_PATH` — SQLite path (default in‑memory)
- `MOCK_CORE` — `1` to stub core API for local/CI

## Scripts

- `dev`, `build`, `serve`, `typecheck`, `lint`, `test:unit`, `test:e2e`

## Accessibility

- Buttons and inputs are keyboard accessible with visible focus
- Axe checks in e2e

## License

MIT

