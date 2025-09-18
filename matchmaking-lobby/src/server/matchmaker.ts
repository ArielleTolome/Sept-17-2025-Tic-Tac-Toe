import { WebSocketServer, WebSocket } from 'ws';
import { z } from 'zod';
import { getRating } from './db';
import { createRoom } from './coreClient';

type Client = { ws: WebSocket; name: string };

export function attachLobby(server: import('http').Server, apiBase: string) {
  const wss = new WebSocketServer({ noServer: true });
  const queue: Client[] = [];

  server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    if (url.pathname !== '/lobby') return;
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  });

  wss.on('connection', (ws) => {
    let name = 'Anon';
    ws.on('message', async (data) => {
      try {
        const base = z.object({ type: z.string() });
        const msg = base.parse(JSON.parse(String(data)));
        if (msg.type === 'hello') {
          const parsed = z.object({ type: z.literal('hello'), name: z.string().min(1).max(40) }).parse(JSON.parse(String(data)));
          name = parsed.name;
        }
        if (msg.type === 'find') {
          queue.push({ ws, name });
          ws.send(JSON.stringify({ type: 'queued' }));
          tryPair();
        }
        if (msg.type === 'cancel') {
          const idx = queue.findIndex((c) => c.ws === ws);
          if (idx >= 0) queue.splice(idx, 1);
        }
      } catch { /* ignore */ }
    });
    ws.on('close', () => {
      const idx = queue.findIndex((c) => c.ws === ws);
      if (idx >= 0) queue.splice(idx, 1);
    });
  });

  async function tryPair() {
    if (queue.length < 2) return;
    // choose two most similar ELOs
    let bestI = 0, bestJ = 1, bestDiff = Infinity;
    for (let i = 0; i < queue.length; i++) {
      for (let j = i + 1; j < queue.length; j++) {
        const a = getRating(queue[i].name);
        const b = getRating(queue[j].name);
        const diff = Math.abs(a - b);
        if (diff < bestDiff) { bestDiff = diff; bestI = i; bestJ = j; }
      }
    }
    const [A] = queue.splice(bestJ, 1);
    const [B] = queue.splice(bestI, 1);
    const room = await createRoom(apiBase, { a: A.name, b: B.name });
    const payload = { type: 'matched', roomId: room.id, url: room.url };
    A.ws.send(JSON.stringify(payload));
    B.ws.send(JSON.stringify(payload));
    // after sending, leave it to clients to navigate
  }
}
