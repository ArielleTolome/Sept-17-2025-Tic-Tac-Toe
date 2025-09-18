# Analytics Dashboard (Read‑Only)

Static dashboard with charts for games/day, duration distribution, W/L/D, active hours, and AI difficulty usage. A small Node server serves the exported site, caches analytics JSON, exposes `/healthz`, and can mock data in offline mode.

## Features

- Next.js static export + Recharts charts
- Cached analytics JSON under `/cache/analytics.json`
- Mock mode for offline dev and CI (`MOCK=1`)
- Security: Helmet, CORS, rate limits; Observability: Pino + request IDs
- Accessibility: high contrast, Playwright + axe-core check

## Quickstart

1. Copy `.env.example` → `.env` and set `API_BASE_URL` (optional in mock mode).
2. Install deps: `npm ci`
3. Build: `npm run build`
4. Serve: `PORT=4200 MOCK=1 npm run serve`
5. Open `http://localhost:4200`

Docker:

```bash
docker compose up --build
```

## Env Vars

- `API_BASE_URL` — core API base (for future real fetch)
- `PORT` — server port (default 4200)
- `ALLOWED_ORIGIN` — CORS origin for `/api` (default `http://localhost:5176`)
- `MOCK` — `1` to serve mock analytics data

## Scripts

- `dev` — Next dev server
- `build` — Next export + server build
- `serve` — start the Node server (serves `out` and `/cache`)
- `test` — unit tests (Vitest)
- `test:e2e` — Playwright + axe-core

## License

MIT

