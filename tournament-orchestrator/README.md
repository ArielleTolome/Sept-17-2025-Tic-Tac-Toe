# Tournament Orchestrator Service + Admin UI

Standalone service to create and manage Tic‑Tac‑Toe tournaments (round‑robin and single‑elimination), create rooms via the core API, monitor via WS, visualize brackets, and export SVG/PDF. No changes to the core app.

## Features

- Create tournaments with players
- Pairings: round‑robin and single‑elimination
- Room creation via `POST /api/rooms` (mockable)
- Monitor rooms via WS for winners (mockable)
- Admin UI with bracket visualization and export (SVG, HTML‑to‑PDF)
- Observability: Pino logs with request IDs; `/healthz`
- Security: Helmet, CORS, rate limits, Zod validation

## Tech

- Node 20 + Express
- React + Vite + Tailwind admin UI
- BullMQ queue (optional), in‑memory fallback
- Vitest (unit), Playwright (e2e)

## Quickstart

1. Copy `.env.example` to `.env` and set values.
2. Install deps: `npm ci`
3. Dev: `npm run dev` (UI on 5174, API proxied by same origin when built)
4. Build + Serve: `npm run build && PORT=4000 npm run serve`
5. Visit: `http://localhost:4000` (UI served by server)

Docker:

```bash
docker compose up --build
# Open http://localhost:4000
```

## Environment Variables

- `API_BASE_URL` — core REST base URL
- `WS_BASE_URL` — core WS base URL
- `PORT` — server port (default `4000`)
- `ALLOWED_ORIGIN` — CORS origin for API routes (default `http://localhost:5174`)
- `REDIS_URL` — optional for BullMQ; fallback to in‑memory if unset
- `MOCK_CORE` — `1` to stub room creation and winners for local/dev/CI

## Scripts

- `dev` — run server and Vite dev
- `build` — build server and client
- `serve` — run built server (serves UI from `dist/client`)
- `typecheck`, `lint`, `test:unit`, `test:e2e`

## Security & Observability

- Helmet, CORS, and rate limits on mutating routes
- Zod validation at all inputs
- Pino with `x-request-id` for traceability

## Accessibility

- UI uses high‑contrast colors, focus states, ARIA labels
- E2E includes axe‑core checks

## Notes

- PNG export is provided as SVG (download) and HTML wrapper for printing to PDF (works reliably in CI/browsers). If headless PNG/PDF is desired, integrate Puppeteer in a follow‑up.

## License

MIT

