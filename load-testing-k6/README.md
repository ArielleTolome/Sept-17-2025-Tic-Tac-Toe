# Load & Soak Testing Suite (k6)

k6 scenarios for REST RPS, WS multiplayer flows (legal/illegal moves), reconnects, and a 2‑hour soak. A Node orchestration script runs k6, collects JSON summaries, and generates an HTML report.

## Scenarios

- Smoke: quick GET `/api/health` sanity
- RPS: constant arrival rate to `/api/health`
- WS: join + move + illegal move + chat, verify connection health
- Soak: mixed REST + WS for long duration

## Quickstart

1. Copy `.env.example` → `.env` and set `API_BASE_URL`, `WS_BASE_URL`.
2. Install: `npm ci`
3. Build: `npm run build`
4. Run smoke: `npm run k6:smoke`
5. Other runs:
   - `npm run k6:rps`
   - `npm run k6:ws`
   - `npm run k6:soak`

Reports are written to `results/*.json` and `results/*.html`.

## Environment Variables

- `API_BASE_URL` — core REST base URL
- `WS_BASE_URL` — core WebSocket base URL
- `OUT_DIR` — output directory (default `./results`)
- `SMOKE_DURATION`, `SMOKE_VUS` — smoke scenario
- `RPS_TARGET`, `RPS_DURATION` — RPS scenario
- `WS_USERS`, `WS_DURATION` — WS scenario
- `SOAK_DURATION`, `SOAK_VUS` — soak scenario

## Docker

```bash
docker compose up --build
# Generates results in ./results
```

## CI

Workflow runs typecheck, lint, unit tests, build, and a short smoke run; artifacts uploaded.

## Notes

- Thresholds are set conservatively (95th percentile latencies and low error rates). Tune per environment.
- The HTML report is minimal and generated from the k6 summary JSON to avoid external dependencies.

## License

MIT

