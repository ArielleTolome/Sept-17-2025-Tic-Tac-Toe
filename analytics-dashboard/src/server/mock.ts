import type { Express } from 'express';
import fs from 'node:fs';
import path from 'node:path';

export function attachMockApi(app: Express) {
  app.get('/api/leaderboard', (_req, res) => {
    res.json({ leaders: [ { name: 'Alice', wins: 12 }, { name: 'Bob', wins: 9 } ] });
  });
  app.get('/api/games/:id', (req, res) => {
    res.json({ id: req.params.id, durationSec: 35, winner: 'X', startedAt: new Date(Date.now()-60_000).toISOString(), finishedAt: new Date().toISOString() });
  });
}

export function writeMockCache(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
  const data = buildMockAnalytics();
  fs.writeFileSync(path.join(dir, 'analytics.json'), JSON.stringify(data, null, 2));
}

export function buildMockAnalytics() {
  const days = Array.from({ length: 7 }, (_, i) => ({ day: i, games: Math.floor(20 + Math.random()*20) }));
  const durations = [10,15,20,25,30,40,60].map((d,i)=>({ bin: d, count: Math.floor(5 + Math.random()*10) }));
  const outcome = [ { label: 'X', value: 30 }, { label: 'O', value: 28 }, { label: 'Draw', value: 12 } ];
  const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, active: Math.floor(10 + Math.random()*20) }));
  const ai = [ { difficulty: 'easy', count: 10 }, { difficulty: 'medium', count: 14 }, { difficulty: 'hard', count: 6 } ];
  return { days, durations, outcome, hours, ai };
}

