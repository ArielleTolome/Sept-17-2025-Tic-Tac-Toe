import { InMemoryQueue, BullMQAdapter, IQueueAdapter, JobPayload } from './queue';
import { createRoom, watchRoom } from './coreClient';
import { getTournament, saveTournament } from './store';

export function makeQueue(apiBase: string, wsBase: string): IQueueAdapter {
  const processor = async (name: string, payload: JobPayload) => {
    if (payload.type === 'create-room') {
      const { tournamentId, matchId, a, b } = payload.data as { tournamentId: string; matchId: string; a: string; b: string };
      const t = getTournament(tournamentId); if (!t) return;
      const room = await createRoom(apiBase, { a, b });
      const m = t.matches.find(m => m.id === matchId); if (m) m.roomId = room.id;
      saveTournament(t);
      return room.id;
    }
    if (payload.type === 'monitor-room') {
      const { tournamentId, matchId, roomId } = payload.data as { tournamentId: string; matchId: string; roomId: string };
      const t = getTournament(tournamentId); if (!t) return;
      const watcher = watchRoom(wsBase, roomId, (result) => {
        const m = t.matches.find(m => m.id === matchId); if (m) m.winner = result.winner === 'Draw' ? undefined : result.winner;
        saveTournament(t);
        watcher.close();
      });
      return true;
    }
  };

  if (process.env.REDIS_URL) {
    return new BullMQAdapter('ttt-tournaments', processor, process.env.REDIS_URL);
  }
  return new InMemoryQueue(processor);
}

