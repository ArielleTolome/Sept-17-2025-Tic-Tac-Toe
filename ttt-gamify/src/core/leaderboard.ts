import { kv, K } from './storage';
import { getProfile } from './identity';
import { selectSummary } from './models/summary';

export type LeaderRow = { userId: string; displayName?: string; totalXp: number; level: number; stars: number };

export function getLocalLeaderboard(): LeaderRow[] {
  return JSON.parse(localStorage.getItem(K.LEADERBOARD_LOCAL) || '[]');
}

export function updateLocalLeaderboard() {
  const rows: LeaderRow[] = getLocalLeaderboard();
  const me = getProfile();
  const s = selectSummary();
  const stars = 0; // derived from store purchases if tracking
  const i = rows.findIndex(r => r.userId === me.userId);
  const row = { userId: me.userId, displayName: me.displayName, totalXp: s.totalXp, level: s.level, stars };
  if (i >= 0) rows[i] = row; else rows.push(row);
  rows.sort((a,b) => b.level - a.level || b.totalXp - a.totalXp);
  localStorage.setItem(K.LEADERBOARD_LOCAL, JSON.stringify(rows.slice(0, 50)));
}

