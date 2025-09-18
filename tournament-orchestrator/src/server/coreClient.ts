import { z } from 'zod';

const createRoomResp = z.object({ id: z.string(), token: z.string().optional() }).passthrough();

export async function createRoom(apiBase: string, players: { a: string; b: string }): Promise<{ id: string, token?: string }> {
  if (process.env.MOCK_CORE === '1') {
    return { id: `ROOM-${players.a}-${players.b}` };
  }
  const res = await fetch(`${apiBase}/api/rooms`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(players)
  });
  const json = await res.json();
  const parsed = createRoomResp.parse(json);
  return { id: parsed.id, token: parsed.token };
}

export type RoomWatcher = { close(): void };

export function watchRoom(wsBase: string, roomId: string, onFinish: (result: { winner: string | 'Draw' })=>void): RoomWatcher {
  if (process.env.MOCK_CORE === '1') {
    const t = setTimeout(() => onFinish({ winner: Math.random() > 0.5 ? 'A' : 'B' }), 500);
    return { close() { clearTimeout(t); } };
  }
  const ws = new WebSocket(wsBase);
  ws.onopen = () => ws.send(JSON.stringify({ type: 'join', roomId }));
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data);
      if (msg.type === 'state' && msg.payload.finished) {
        onFinish({ winner: msg.payload.winner ?? 'Draw' });
      }
    } catch { /* ignore */ }
  };
  return { close() { try { ws.close(); } catch { /* ignore */ } } };
}

