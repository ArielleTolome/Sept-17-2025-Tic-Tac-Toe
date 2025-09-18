# Spectator & Replay Viewer SPA

Standalone, production-ready viewer to spectate live Tic-Tac-Toe rooms and replay finished games. Integrates only via the core app's HTTP and WebSocket APIs.

## Features

- Live spectating via WebSocket `state` and `presence` events (read‑only)
- Replay finished games from `GET /api/games/:id` with scrubber, play/pause, speed
- Deep links like `/#/replay/:gameId?autoPlay=1`
- Offline mock API + WS server for local dev and CI
- WCAG AA basics: keyboard focus, high contrast, ARIA roles
- Observability: Pino logs with request IDs, `/healthz`

## Tech

- React + Vite + Tailwind (TypeScript)
- Zustand for simple state, Zod for validation
- Node 20, Express + Helmet + rate limits
- Vitest (unit), Playwright (e2e)

## Quickstart

1. Copy `.env.example` to `.env` and adjust as needed.
2. Install deps: `npm ci`
3. Dev (client only, proxy to real API): `npm run dev`
4. Mock server + static (build required):
   - Build: `npm run build`
   - Start with mocks: `MOCK=1 PORT=3000 npm run serve`
5. E2E with mock server: `npm run test:e2e`

Docker (local example):

```bash
docker compose up --build
# Open http://localhost:3000
```

## Environment Variables

- `API_BASE_URL` — base URL of the core REST API (e.g., `http://localhost:8080`)
- `WS_BASE_URL` — base URL for WebSocket (e.g., `ws://localhost:8080/ws`)
- `PORT` — port for the bundled server (default `3000`)
- `ALLOWED_ORIGIN` — CORS origin for API routes when mocking (default `http://localhost:5173`)
- `MOCK` — set to `1` to enable built‑in mock API + WS

When using Vite dev server, requests to `/api/*` are proxied to `API_BASE_URL` unless `MOCK=1`.

## Scripts

- `dev` — Vite dev server (React)
- `build` — build client + server
- `serve` — start server (serves static client and exposes `/healthz` and mocks when `MOCK=1`)
- `typecheck` — TypeScript type check
- `lint` — ESLint
- `test:unit` — Vitest unit tests
- `test:e2e` — Playwright e2e tests (starts built server with `MOCK=1`)

## Security

- Helmet for common protections
- CORS restricted to `ALLOWED_ORIGIN` on API routes (mock only)
- Rate limits on non‑GET routes (`/api/*`)
- All external input validated with Zod
- No secrets in repo; configure via env vars

## Observability

- Pino HTTP logs with `x-request-id`
- Health endpoint: `GET /healthz`

## Accessibility

- Keyboard focus states and ARIA roles on board cells
- High contrast color scheme
- Playwright + axe-core e2e audit

## Troubleshooting

- WebSocket not connecting? Confirm `WS_BASE_URL` and that your core server accepts spectator connections. If authorization is required, paste a token in the Live Spectate form.
- 404 on `/#/replay/:id` in production: The server serves SPA fallback; ensure you are using hash links or the same route base.

## License

MIT

