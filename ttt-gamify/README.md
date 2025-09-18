# TTT Gamify Overlay

Production-grade, zero-touch Gamification & Frontend Content Overlay for any Tic‑Tac‑Toe app. Ships as:

- MV3 Browser Extension (content script injects React overlay root)
- Userscript (`dist/ttt-gamify.user.js`) and Bookmarklet (`dist/bookmarklet.txt`)
- Optional Companion Hub site (loads live app in an iframe and mounts the same overlay)
- Optional Sidecar API service (Fastify) with anonymous tokens

This overlay never edits or restructures host DOM; it derives events passively and renders UI in its own root `#ttt-gamify-root` with namespaced styles (`.ttt-gamify`). Pointer events are disabled globally and enabled only on overlay UI containers, ensuring non-interference.

## Features

- Identity: stable anonymous ID, optional display name and avatar
- XP & Levels: configurable ledger, quick-win bonus, daily cap
- Achievements: 30+ unlocks across play, speed, streaks, cosmetics
- Quests & Streaks: daily/weekly RNG with seed; streak calendar
- Soft Currency: stars; cosmetic store (board/piece/confetti/sound/bg)
- Leaderboards: local device; global via Sidecar (optional)
- Social: share cards (Canvas PNG), referrals (server optional)
- Tutorials/Puzzles/Strategy: in overlay sandbox (no host interaction)
- Accessibility: WCAG AA, ARIA, keyboard focus, reduced-motion
- Privacy: no PII by default; local-first storage; anonymous server tokens

## Repo Layout

```
ttt-gamify/
  src/                # overlay code (React/TS)
  scripts/            # packaging: userscript/bookmarklet/extension
  extension/          # MV3 manifest + content injector
  companion/          # iframe wrapper app (optional)
  server/             # sidecar Fastify service (optional)
  themes/             # CSS variable packs
  tests/              # vitest + Playwright
  docs/               # achievements, quests, tokens, telemetry
  dist/               # build outputs
```

## Quick Start

Prereqs: Node 20

- Install: `cd ttt-gamify && npm install`
- Dev overlay: `npm run dev` (opens dev harness page)
- Build overlay: `npm run build` (outputs `dist/ttt-gamify.iife.js` and `es`)
- Package all delivery methods: `npm run package:all`
- Unit tests: `npm test`
- E2E tests: `npm run e2e` (requires Chromium via Playwright)

## Delivery Methods

1) Userscript
- Build: `npm run package:userscript`
- Install the output `dist/ttt-gamify.user.js` in Tampermonkey/Violentmonkey

2) Bookmarklet
- Build: `npm run package:bookmarklet`
- Paste the content of `dist/bookmarklet.txt` as a bookmark URL

3) MV3 Extension
- Build: `npm run package:extension` → `dist/extension/`
- Load as unpacked extension in Chrome (Developer mode)

4) Companion Hub (optional)
- Dev: `npm run companion:dev`
- Build: `npm run companion:build` (outputs into `dist/companion`)

## Optional Sidecar API

- Dev (in-memory): `npm run server:ts` (PORT=8787)
- Endpoints: `/healthz`, `/v1/identify`, `/v1/profile`, `/v1/event`, `/v1/summary`, `/v1/leaderboard`, `/v1/referrals/claim`
- Security: CORS, rate limits, Zod validation, anonymous tokens only

Environment (overlay):
- `VITE_GAMIFY_API_BASE` (optional)
- `VITE_DEFAULT_THEME` (default `dark`)
- `VITE_DAILY_XP_CAP` (default 400)
- `VITE_SEASON_LENGTH_DAYS` (default 90)

## Accessibility

- Overlay uses ARIA roles, live regions for toasts, and honors `prefers-reduced-motion`
- Keyboard navigation across Hub tabs; pointer-events only on overlay UI

## Non‑Interference

- No handlers are captured from the host app; overlay attaches observers only
- Overlay root uses fixed positioning and the highest z-index; all global pointer-events are disabled except on `[data-ui]` containers

## Privacy

- No PII by default; data stored locally with LocalForage
- Optional server sync uses anonymous tokens

## CI

`ttt-gamify` has a scoped CI workflow at `.github/workflows/ttt-gamify-ci.yml` that typechecks, builds, runs tests, and uploads artifacts.
