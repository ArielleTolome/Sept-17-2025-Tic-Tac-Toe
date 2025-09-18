import type { Express } from 'express';
import { z } from 'zod';
import { WebSocketServer } from 'ws';
import type { Server } from 'node:http';

const joinSchema = z.object({ type: z.literal('join'), roomId: z.string(), token: z.string().optional() });

export function attachMock(app: Express, server: Server) {
  // REST endpoints
  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.get('/api/games/:id', (req, res) => {
    const id = req.params.id;
    const game = buildDemoGame(id);
    res.json(game);
  });

  // WS server at /ws
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    if (url.pathname !== '/ws') return;
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  wss.on('connection', (ws) => {
    let roomId = 'ROOM-DEMO';
    ws.on('message', (data) => {
      try {
        const json = JSON.parse(String(data));
        const parsed = joinSchema.safeParse(json);
        if (parsed.success) {
          roomId = parsed.data.roomId;
          ws.send(
            JSON.stringify({
              type: 'presence',
              payload: { players: { X: `${roomId}-Alice`, O: `${roomId}-Bob` } }
            })
          );
          // start simulated game state
          simulate(ws);
        }
      } catch {
        // ignore
      }
    });
  });
}

function simulate(ws: import('ws').WebSocket) {
  const boards: Array<Array<'' | 'X' | 'O'>> = [
    ['', '', '', '', '', '', '', '', ''],
    ['X', '', '', '', '', '', '', '', ''],
    ['X', '', '', 'O', '', '', '', '', ''],
    ['X', 'X', '', 'O', '', '', '', '', ''],
    ['X', 'X', '', 'O', 'O', '', '', '', ''],
    ['X', 'X', 'X', 'O', 'O', '', '', '', ''] // X wins
  ];
  let i = 0;
  const interval = setInterval(() => {
    if (ws.readyState !== ws.OPEN) {
      clearInterval(interval);
      return;
    }
    ws.send(JSON.stringify({ type: 'state', payload: { board: boards[i], next: i % 2 ? 'X' : 'O' } }));
    i += 1;
    if (i >= boards.length) clearInterval(interval);
  }, 800);
}

function buildDemoGame(id: string) {
  const start = Date.now() - 60_000;
  const moves = [
    { player: 'X', index: 0, ts: start + 1_000 },
    { player: 'O', index: 3, ts: start + 3_000 },
    { player: 'X', index: 1, ts: start + 5_000 },
    { player: 'O', index: 4, ts: start + 6_000 },
    { player: 'X', index: 2, ts: start + 8_000 }
  ];
  return {
    id,
    startedAt: new Date(start).toISOString(),
    finishedAt: new Date(start + 10_000).toISOString(),
    winner: 'X',
    moves
  } satisfies {
    id: string;
    startedAt: string;
    finishedAt: string;
    winner: 'X' | 'O' | 'Draw';
    moves: { player: 'X' | 'O'; index: number; ts: number }[];
  };
}

