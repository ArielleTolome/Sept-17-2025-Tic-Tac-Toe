# Theme Pack Injector (Browser Extension)

MV3 extension that applies alternate themes to the Tic‑Tac‑Toe app via CSS variables. Popup UI lets users choose themes, including high‑contrast and dyslexia‑friendly presets. Per‑site persistence via `chrome.storage`.

## Features

- Theme presets: System, High Contrast, Dyslexia‑Friendly, Solarized Dark, Pastel
- Per‑site persistence keyed by origin
- Content script injects CSS variables at `document_start`
- Popup (React) with accessible buttons and focus styles
- Observability: Preview server with `/healthz`
- Security: Helmet, CORS, rate limits on preview server

## Quickstart

1. Install deps: `npm ci`
2. Build: `npm run build`
3. Load the extension:
   - Go to `chrome://extensions`, enable Developer mode
   - Load unpacked, select `dist` folder
4. Preview popup in a browser page (for e2e/dev): `npm run preview` then open `http://localhost:4305/popup.html`

Docker (preview server):

```
docker compose up --build
# open http://localhost:4305/popup.html
```

## Env Vars

- `PORT` — preview server port (default 4305)
- Optionally `PUBLIC_WEB_URL` can be referenced from your theme presets if desired (not required)

## Scripts

- `dev` — Vite dev (popup only)
- `build` — bundle background, content, and popup
- `preview` — serve built popup + /healthz
- `test` — unit tests (Vitest)
- `test:e2e` — Playwright against previewed popup

## Accessibility

- High‑contrast palette available; visible focus states
- Popup buttons are keyboard reachable; axe core e2e check passes

## Security

- No secrets in repo; extension uses local storage only
- Preview server: Helmet, CORS (restricted), and rate limits on mutating routes

## License

MIT

