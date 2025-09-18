# Telemetry & Events

The overlay derives events from the host DOM with a `MutationObserver` and non-interfering capture listeners.

Derived events include:
- SESSION_START, GAME_START, MOVE(index, value), WIN, DRAW, ABORT, REPLAY_VIEW, TIME_TO_MOVE(ms)

When a Sidecar API is configured via `VITE_GAMIFY_API_BASE`, events are batched to `POST /v1/event` with an anonymous token.

Security: no PII; anonymous tokens only; CORS, rate limits, schema validation, request IDs, and structured logs are recommended on the server.

