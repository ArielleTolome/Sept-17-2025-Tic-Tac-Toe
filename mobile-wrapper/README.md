# Mobile Wrapper (Capacitor)

Wraps the Tic‑Tac‑Toe web app for iOS/Android using Capacitor. Supports deep links like `ttt://game/:id`, local notifications for “your turn” (via a simple WS watcher demo), an offline page, and a pull‑to‑refresh button.

## Features

- Loads `PUBLIC_WEB_URL` inside an in‑app WebView
- Deep links: `ttt://game/:id` → navigates to `/#/replay/:id?autoPlay=1`
- Local notifications: demo watcher for WS state with `yourTurn` flag
- Offline page state + Refresh control
- Observability: Pino logs + `/healthz`
- Security: Helmet, CORS, rate limits (preview server)

## Quickstart

1. Copy `.env.example` → `.env` and set `PUBLIC_WEB_URL`.
2. Install deps: `npm ci`
3. Build preview: `npm run build`
4. Preview in browser: `PORT=4400 npm run preview` → open `http://localhost:4400`
5. Initialize native platforms (optional, on macOS/Linux):
   ```bash
   npx cap init "TicTacToe" com.example.ttt
   npx cap add ios
   npx cap add android
   # Copy web assets to native
   npx cap copy
   ```
6. Open native projects in IDEs: `npx cap open ios` or `npx cap open android`

Docker:

```bash
docker compose up --build
# open http://localhost:4400
```

## Env Vars

- `PUBLIC_WEB_URL` — the core web app URL to wrap (e.g., `http://localhost:5173`)
- `API_BASE_URL`, `WS_BASE_URL` — optionally used by the notification demo
- `PORT` — preview server port (default 4400)

## Scripts

- `dev` — Vite dev server for the wrapper web UI
- `build` — build web UI + preview server
- `preview` — start preview server (serves `dist/client` and `/healthz`)
- `test` — unit tests (Vitest)
- `test:e2e` — Playwright e2e (browser preview)

## Notes

- On device/emulator, configure URL schemes for `ttt://` in native projects (Xcode/AndroidManifest). The Capacitor `App` plugin’s `appUrlOpen` handler in `src/client/main.ts` parses links.
- The notification demo expects the WS `state` payload to include `yourTurn`. Adjust to your server’s contract as needed.

## License

MIT

