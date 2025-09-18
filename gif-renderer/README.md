# GIF/Video Renderer for Replays

Render finished games from `/api/games/:id` to animated GIF via node‑canvas. Exposes `GET /render/:gameId.gif`.

## Quickstart

```bash
npm ci
npm run build
MOCK=1 PORT=4900 npm start
# Open http://localhost:4900/render/DEMO.gif
```

Docker:

```bash
docker compose up --build
```

## Env Vars

- `API_BASE_URL` — core API base (for non-mock)
- `PORT` — server port (default 4900)
- `ALLOWED_ORIGIN` — CORS origin for API (not used by current endpoints)
- `MOCK` — `1` to render a built-in demo game

## Notes

- The GIF renders a frame per move with basic grid + X/O drawing.
- For MP4 output, consider integrating FFmpeg or Puppeteer recording in a follow-up.

## License

MIT

