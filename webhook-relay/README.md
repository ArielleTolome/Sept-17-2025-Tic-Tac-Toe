# Webhook Relay (Slack/Email/SMS/Discord)

Subscribe to Tic‑Tac‑Toe WS events and trigger webhooks to Slack, SMTP email, Twilio SMS, and Discord. Simple rules engine with templates and retries.

## Features

- WS subscription per room (from `WS_BASE_URL`)
- Rules JSON with events: `start`, `turn`, `win`, `draw`
- Channels: `slack`, `discord`, `email`, `sms`
- Exponential backoff retries
- Security: Helmet, CORS, rate limits
- Observability: Pino + `/healthz`

## Quickstart

1. Copy `.env.example` → `.env` and set `WS_BASE_URL` and any integration creds you want.
2. Prepare rules: copy `rules.example.json` to `rules.json` and edit.
3. Install: `npm ci`
4. Build: `npm run build`
5. Run: `RULES_PATH=./rules.json PORT=4700 node dist/index.js`
6. Subscribe a room via API:
   ```bash
   curl -X POST http://localhost:4700/api/subscribe -H 'content-type: application/json' -d '{"roomId":"ROOM-123"}'
   ```

Docker:

```bash
docker compose up --build
```

## Env Vars

- `WS_BASE_URL` — core WebSocket base
- `PORT` — server port (default 4700)
- `ALLOWED_ORIGIN` — CORS origin for API
- `RULES_PATH` — path to rules JSON
- `SLACK_WEBHOOK_URL`, `DISCORD_WEBHOOK_URL`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`, `TWILIO_TO`

## Rules JSON

```json
{
  "rules": [
    { "event": "start", "channels": ["slack"], "template": "Game {{roomId}} started" },
    { "event": "win", "channels": ["email"], "template": "Winner: {{winner}} in {{roomId}}" }
  ]
}
```

Placeholders: `{{roomId}}`, `{{player}}`, `{{winner}}`.

## License

MIT

