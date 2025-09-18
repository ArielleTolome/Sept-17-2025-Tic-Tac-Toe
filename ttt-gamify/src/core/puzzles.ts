import { mulberry32, seedFromString } from './utils/rng';

export type Puzzle = { id: string; title: string; moves: number };

const BASE: Puzzle[] = [
  { id: 'p1', title: 'Win in 2 from center', moves: 2 },
  { id: 'p2', title: 'Fork setup', moves: 3 },
  { id: 'p3', title: 'Block the fork', moves: 2 },
  { id: 'p4', title: 'Corner trap', moves: 3 },
  { id: 'p5', title: 'Force a draw', moves: 2 },
];

export function puzzlesCatalog() { return BASE; }

export function getDailyChallenge() {
  const key = new Date().toISOString().slice(0,10);
  const rng = mulberry32(seedFromString('puzzle-'+key));
  const p = BASE[Math.floor(rng() * BASE.length)];
  return { ...p, rewardXp: 40, rewardStars: 12 };
}

