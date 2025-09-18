import type { Express } from 'express';
import { ingestGame } from './poller';

export function attachMock(app: Express) {
  // Seed some players
  const games = [
    { id: 'G1', x: 'Alice', o: 'Bob', winner: 'X', finishedAt: new Date().toISOString() },
    { id: 'G2', x: 'Charlie', o: 'Dana', winner: 'O', finishedAt: new Date().toISOString() },
    { id: 'G3', x: 'Alice', o: 'Charlie', winner: 'Draw', finishedAt: new Date().toISOString() }
  ] as any[];
  for (const g of games) ingestGame(g);

  // Optional mock endpoint similar to core
  app.get('/api/games', (req, res) => {
    const since = Number(req.query.since || 0);
    res.json({ games });
  });
}

