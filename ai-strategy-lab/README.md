# AI‑vs‑AI Simulator & Strategy Lab

Pit Minimax/Negamax/MCTS/Heuristic bots against each other, run quick leagues, and visualize opening move heatmaps. Export SVG heatmaps and run a small UI.

## Features

- Bots: Minimax, Negamax, MCTS (simple UCT), Heuristic
- CLI: run matches, leagues, and export heatmaps (SVG)
- UI: run a match and download heatmap SVG
- Observability: Pino logs with `/healthz` on the UI server

## CLI

Build then run:

```
npm run build
node dist/cli/index.js match --x minimax --o heuristic
node dist/cli/index.js league --bots minimax,negamax,heuristic
node dist/cli/index.js heatmap --bot minimax --out heatmap.svg
```

## UI

```
npm run dev        # Dev server on 5177
npm run build && PORT=4500 npm run preview  # Prod build + server
```

Open http://localhost:4500.

## Tests

- `npm test` for unit tests of rules and bots
- `npm run test:e2e` for UI smoke + axe check

## Docker

```
docker compose up --build
# open http://localhost:4500
```

## License

MIT

