import { z } from 'zod';

const wsMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('state'), payload: z.object({ board: z.array(z.union([z.literal('X'), z.literal('O'), z.literal('')])).length(9), next: z.union([z.literal('X'), z.literal('O')]).optional(), finished: z.boolean().optional(), winner: z.union([z.literal('X'), z.literal('O'), z.literal('Draw')]).optional() }) }),
  z.object({ type: z.literal('presence'), payload: z.any() }),
  z.object({ type: z.literal('error'), payload: z.object({ message: z.string() }) })
]);

export function subscribeRoom(wsBase: string, roomId: string, onSummary: (summary: string)=>void) {
  const ws = new WebSocket(wsBase);
  ws.onopen = () => ws.send(JSON.stringify({ type: 'join', roomId }));
  ws.onmessage = (ev) => {
    try {
      const parsed = wsMessageSchema.safeParse(JSON.parse(ev.data as string));
      if (!parsed.success) return;
      const msg = parsed.data;
      if (msg.type === 'state') {
        const grid = msg.payload.board.map((c, i) => (i % 3 === 2 ? (c || '·') + '\n' : (c || '·') + ' ')).join('');
        const meta = msg.payload.finished ? `Finished. Winner: ${msg.payload.winner}` : `Next: ${msg.payload.next || 'TBD'}`;
        onSummary('``\n' + grid + '``\n' + meta);
      }
    } catch { /* ignore */ }
  };
  ws.onerror = () => { try { ws.close(); } catch {} };
  return ws;
}

