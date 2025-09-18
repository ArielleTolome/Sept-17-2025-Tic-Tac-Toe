import type { Express } from 'express';

export function attachMock(app: Express) {
  const rooms = [
    { id: 'ROOM-1', players: ['Alice', 'Bob'], createdAt: Date.now() - 300000 },
    { id: 'ROOM-2', players: ['Charlie', 'Dana'], createdAt: Date.now() - 120000 }
  ];
  const games = [
    { id: 'G-1', x: 'Alice', o: 'Bob', winner: 'Alice', finishedAt: Date.now() - 3600000 },
    { id: 'G-2', x: 'Charlie', o: 'Dana', winner: 'Dana', finishedAt: Date.now() - 1800000 }
  ];
  app.get('/api/rooms', (_req, res) => res.json({ rooms }));
  app.get('/api/games/recent', (_req, res) => res.json({ games }));
}

