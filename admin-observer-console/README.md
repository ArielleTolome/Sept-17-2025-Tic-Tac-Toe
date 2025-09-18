# Admin Observer Console (Read‑Only)

Read‑only console for current rooms, active players, recent games; includes search, filters, CSV export; passive WS presence can be added via `WS_BASE_URL`.

## Features

- Rooms and recent games tables (TanStack Table)
- Search filter and CSV export for rooms
- Mock API for offline/dev; secure server with `/healthz`

## Quickstart

```bash
npm ci
npm run build && MOCK=1 PORT=4800 npm run preview
# open http://localhost:4800
```

Docker:

```bash
docker compose up --build
```

## Env Vars

- `API_BASE_URL`, `WS_BASE_URL` — optional for future live data
- `PORT` — server port (default 4800)
- `ALLOWED_ORIGIN` — CORS origin for API
- `MOCK` — `1` to serve mock rooms/games

## Scripts

- `dev`, `build`, `preview`, `test:unit`, `test:e2e`

## License

MIT

