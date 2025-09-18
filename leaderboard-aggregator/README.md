# Leaderboard Aggregator (ELO)

Aggregates finished games from the core API to compute ELO ratings per display name, exposes `/api/leaderboard` and CSV export, takes weekly snapshots, and includes a small React UI.

## Features

- ELO aggregation with SQLite storage (file via `DATABASE_URL`)
- REST API: `/api/leaderboard`, `/api/leaderboard.csv`, `/api/snapshots`, `/api/snapshots/:id.csv`
- Poller for finished games (mock mode for CI/local)
- React UI table with CSV export
- Security: Helmet, CORS restricted, rate limits, Zod at boundaries (light)
- Observability: Pino logs and `/healthz`

## Quickstart

1. Copy `.env.example` → `.env` and set `API_BASE_URL`.
2. Install deps: `npm ci`
3. Build: `npm run build`
4. Run (mock): `MOCK=1 PORT=4600 npm run preview` → http://localhost:4600

Docker:

```bash
docker compose up --build
```

## Env Vars

- `API_BASE_URL` — core API base URL
- `DATABASE_URL` — SQLite path like `sqlite:./data/leaderboard.sqlite`
- `PORT` — server port (default 4600)
- `ALLOWED_ORIGIN` — allowed origin for UI (default `http://localhost:5178`)
- `MOCK` — `1` to seed mock data and skip polling
- `POLL_INTERVAL_MS` — poll frequency (default 60000)
- `SNAPSHOT_CRON_MS` — snapshot frequency in ms (default 7 days)

## Scripts

- `dev` — server + Vite dev
- `build` — build client + server
- `preview` — start built server
- `test:unit`, `test:e2e`

## Security & Observability

- Helmet, restricted CORS, rate limits
- Pino with request IDs
- `/healthz` endpoint

## License

MIT

