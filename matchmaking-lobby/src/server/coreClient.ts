import { z } from 'zod';

const createRoomResp = z.object({ id: z.string() }).passthrough();

export async function createRoom(apiBase: string, players: { a: string; b: string }): Promise<{ id: string, url: string }> {
  if (process.env.MOCK_CORE === '1') {
    const id = `ROOM-${players.a}-${players.b}`;
    return { id, url: `${apiBase.replace(/\/api$/, '')}/#/room/${id}` };
  }
  const res = await fetch(`${apiBase}/api/rooms`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(players)
  });
  const json = await res.json();
  const parsed = createRoomResp.parse(json);
  return { id: parsed.id, url: `${apiBase.replace(/\/api$/, '')}/#/room/${parsed.id}` };
}

