# Tic-Tac-Toe Discord Bot

Slash commands to create rooms, join rooms, spectate finished games, and subscribe a channel to live updates via WebSocket. Integrates only with the core app HTTP/WS APIs.

## Commands

- `/ttt create [opponent]` — create a room, reply with join link
- `/ttt join roomid` — reply with join link for a room
- `/ttt spectate gameid` — reply with replay deep link
- `/ttt live roomid` — subscribe the current channel to live WS updates (board snapshots)

## Setup

1. Create a Discord application and bot; invite it to your server with the `applications.commands` scope.
2. Copy `.env.example` to `.env` and set `DISCORD_TOKEN`, `API_BASE_URL`, `WS_BASE_URL`.
3. Install deps: `npm ci`
4. Build: `npm run build`
5. Deploy slash commands: `npm run commands:deploy` (set `GUILD_ID` to limit to a test guild)
6. Start: `npm start`

Health endpoint at `GET /healthz` (port `PORT`, default 4300).

## Environment

- `DISCORD_TOKEN` — bot token
- `GUILD_ID` — optional test guild for command registration
- `API_BASE_URL` — core API base (e.g., `http://localhost:8080`)
- `WS_BASE_URL` — core WebSocket base (e.g., `ws://localhost:8080/ws`)
- `PORT` — HTTP health server port (default 4300)
- `ALLOWED_ORIGIN` — CORS origin for `/api` if extended (default `http://localhost:5173`)

## Security & Observability

- Helmet, CORS, rate limits (on non-GET if routes added)
- Pino logs with request IDs
- Inputs validated with Zod

## Docker

```bash
docker compose up --build
```

## Testing

- `npm test` — unit tests (Vitest)
- CI runs typecheck, lint, tests, and build

## License

MIT

