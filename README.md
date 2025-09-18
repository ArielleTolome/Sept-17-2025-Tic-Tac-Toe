# Tic-Tac-Toe UI Enhancer (Zero-Touch)

Production-ready, non-destructive overlay that upgrades visual design, accessibility, and interactions for existing Tic-Tac-Toe web apps — without modifying their code. Ships as a browser extension (MV3), a UserScript, a bookmarklet, and an optional wrapper “skin”.

## Features
- Modern themes: Light, Dark, High-Contrast, color-vision–safe variants; dyslexia font option
- Responsive polish: crisp grid, safe-area insets, fluid scaling
- A11y: aria-live announcements, skip link, visible focus outlines, keyboard shortcuts overlay (press `?`)
- Board visuals: ghost mark preview, placement micro-animations, animated winning line, confetti (respects reduce motion)
- Settings: floating gear button with theme, font scale, reduce motion, sounds, haptics, tooltips, and tips on start; import/export JSON
- Coach marks: step-through guide highlighting key areas
- Tooltips and toasts: accessible, non-blocking

Zero-touch: no host DOM nodes are removed or replaced; overlays are siblings and use `pointer-events: none` by default. Preferences are stored locally; no telemetry.

## Install & Use

### Browser Extension (MV3)
1. Build the project: `npm i && npm run build`
2. Load extension in Chrome: `chrome://extensions` → Enable Developer Mode → Load unpacked → select `extension/` folder.
3. By default, it runs on all sites. Optional: restrict in extension details to your Tic-Tac-Toe site.

### UserScript
1. Build: `npm i && npm run build`
2. Install Tampermonkey or Greasemonkey.
3. Drag-drop `dist/ttt-ui-enhancer.user.js` into your userscript manager.
4. Restrict the `@match` in the header if desired.

### Bookmarklet
1. Build: `npm i && npm run build`
2. Open `dist/bookmarklet.txt` and copy its single-line `javascript:` URL.
3. Create a new bookmark and paste as the URL; click it on your Tic-Tac-Toe page.

### Wrapper “Skin” App (optional)
Static page that loads your app in an `<iframe>` and layers this enhancer on top.
1. Set target URL by adding `?url=https://your.app.example` to `skin/index.html` when opening locally, or edit the default in the file.
2. Serve `skin/` with any static server (e.g., `npx http-server skin`).
3. Docker: see `skin/Dockerfile`.

## Build
- `npm run build` → Vite build + userscript + bookmarklet + copies extension content script
- Outputs:
  - `dist/ttt-ui-enhancer.iife.js` (core bundle)
  - `dist/ttt-ui-enhancer.user.js` (UserScript)
  - `dist/bookmarklet.txt` (Bookmarklet URL)
  - `extension/` (MV3 extension with `content.js` and icons)
  - `themes/` (exportable CSS token sets)

## Tests
- Unit (Vitest): DOM discovery, preferences store, token switching
  - `npm run test`
- E2E (Playwright): attachment, settings panel, shortcuts overlay against a bundled mock app
  - Build first: `npm run build`
  - Run: `npm run e2e`

## CI
GitHub Actions workflow runs typecheck, lint, unit tests, build, and e2e tests.

## Security & Privacy
- No network calls added; no telemetry, no PII capture
- Preferences stored in `localStorage` under `ttt-ui-enhancer:v1`
- Overlay is non-destructive and cleans up on page hide/unload

## Troubleshooting
- “UI Enhancer idle—app not detected.” → The enhancer couldn’t find a 3×3 grid. Ensure your board has recognizable roles/selectors (e.g., `[role="grid"]` with 9 `[role="gridcell"]`).
- High-contrast: verify your site background doesn’t hide overlays; use the settings panel to switch themes.
- Reduce motion: match system setting or toggle in settings to eliminate non-essential motion.
- Sounds/Haptics: muted by default; enable in settings. Some browsers block AudioContext until user gesture.

## Uninstallation
- Disable or remove the extension, delete the userscript, or remove the bookmarklet. No residual styles remain after a reload.

## Env Variables
- `PUBLIC_APP_URL` (wrapper only): default URL for `skin/index.html`.
- Optional defaults via editing `src/store/prefs.ts`: `DEFAULT_THEME`, `DEFAULT_FONT_SCALE`, `DEFAULT_REDUCE_MOTION` (kept simple for bundle size).

## License
MIT — see LICENSE.

