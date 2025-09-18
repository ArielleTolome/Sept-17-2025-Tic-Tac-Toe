import fetch from 'node-fetch';
import { getDB, isIngested, markIngested, upsertPlayer } from './db';
import { updateElo } from './elo';

type FinishedGame = {
  id: string;
  x: string;
  o: string;
  winner: 'X'|'O'|'Draw';
  finishedAt: string;
}

export async function poll(apiBase: string, sinceTs: number): Promise<number> {
  // Try a hypothetical endpoint /api/games?status=finished&since=...
  try {
    const url = `${apiBase}/api/games?status=finished&since=${sinceTs}`;
    const res = await fetch(url);
    if (!res.ok) return 0;
    const json = await res.json();
    const games: FinishedGame[] = Array.isArray(json?.games) ? json.games : [];
    let count = 0;
    for (const g of games) {
      if (isIngested(g.id)) continue;
      ingestGame(g);
      markIngested(g.id);
      count++;
    }
    return count;
  } catch {
    return 0;
  }
}

export function ingestGame(g: FinishedGame) {
  // read current ratings
  const db = getDB();
  const a = db.prepare('SELECT elo, games, wins, losses, draws FROM players WHERE name=?').get(g.x) as any || { elo: 1000, games:0, wins:0, losses:0, draws:0 };
  const b = db.prepare('SELECT elo, games, wins, losses, draws FROM players WHERE name=?').get(g.o) as any || { elo: 1000, games:0, wins:0, losses:0, draws:0 };
  let outcomeA: 1|0|0.5 = 0.5;
  if (g.winner === 'X') outcomeA = 1; else if (g.winner === 'O') outcomeA = 0; else outcomeA = 0.5;
  const { newA, newB } = updateElo(a.elo, b.elo, outcomeA);
  upsertPlayer(g.x, { elo: newA, games: a.games + 1, wins: a.wins + (g.winner==='X'?1:0), losses: a.losses + (g.winner==='O'?1:0), draws: a.draws + (g.winner==='Draw'?1:0) });
  upsertPlayer(g.o, { elo: newB, games: b.games + 1, wins: b.wins + (g.winner==='O'?1:0), losses: b.losses + (g.winner==='X'?1:0), draws: b.draws + (g.winner==='Draw'?1:0) });
}

