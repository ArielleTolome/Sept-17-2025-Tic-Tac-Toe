import { kv, K } from '../storage';
import { ACHIEVEMENTS, Achievement } from './list';
import { eventBus } from '../events/eventBus';
import { addXp } from '../models/xp';
import { now, isBetweenHours } from '../utils/time';

export type Unlock = { id: string; at: number };

type History = {
  games: number;
  wins: number;
  draws: number;
  losses: number;
  winStreak: number;
  maxWinStreak: number;
  todayWins: number;
  todayLosses: number;
  totalMoves: number;
  totalMoveTime: number; // ms
  replaysWatched: number;
  puzzlesCompleted: number;
  cosmeticsOwned: number;
  themesEquipped: number;
};

const defaults: History = { games: 0, wins: 0, draws: 0, losses: 0, winStreak: 0, maxWinStreak: 0, todayWins: 0, todayLosses: 0, totalMoves: 0, totalMoveTime: 0, replaysWatched: 0, puzzlesCompleted: 0, cosmeticsOwned: 0, themesEquipped: 0 };

let history: History = defaults;
let unlocked: Unlock[] = [];

export async function loadAchievements() {
  unlocked = await kv.get<Unlock[]>(K.ACH_UNLOCKS, []);
  history = await kv.get<History>(K.HISTORY, defaults);
}

export function getAchievements(): Achievement[] { return ACHIEVEMENTS; }
export function getUnlocked(): Unlock[] { return unlocked; }

function has(id: string) { return unlocked.some((u) => u.id === id); }
async function unlock(a: Achievement) {
  if (has(a.id)) return;
  const rec = { id: a.id, at: now() };
  unlocked.push(rec);
  await kv.set(K.ACH_UNLOCKS, unlocked);
  if (a.rewardXp) {
    const { level, totalXp } = await addXp(a.rewardXp);
    eventBus.emit('LEVEL_UP', { level, totalXp });
  }
  eventBus.emit('TOAST', { id: `ach-${a.id}-${rec.at}`, text: `Achievement unlocked: ${a.name} (+${a.rewardXp} XP)` });
}

function checkAll(ctx: { totalMs: number; moves: number; firstMoveIndex?: number; won: boolean }) {
  // Dozens of simple checks derived from history and context
  if (ctx.won) {
    if (history.wins >= 1) ACHIEVEMENTS[0] && unlock(ACHIEVEMENTS.find(a => a.id==='first_win')!);
    if (history.wins >= 10) unlock(ACHIEVEMENTS.find(a => a.id==='ten_wins')!);
    if (history.wins >= 100) unlock(ACHIEVEMENTS.find(a => a.id==='hundred_wins')!);
    if (ctx.totalMs < 20_000) unlock(ACHIEVEMENTS.find(a => a.id==='speed_runner')!);
    if (isBetweenHours(1,5)) unlock(ACHIEVEMENTS.find(a => a.id==='night_owl')!);
    if (isBetweenHours(6,8)) unlock(ACHIEVEMENTS.find(a => a.id==='early_bird')!);
    if (ctx.moves <= 3) unlock(ACHIEVEMENTS.find(a => a.id==='clean_sweep')!);
  }
  if (history.games >= 100) unlock(ACHIEVEMENTS.find(a => a.id==='hundred_games')!);
  if (history.draws >= 10) unlock(ACHIEVEMENTS.find(a => a.id==='draw_10')!);
  const avgMove = history.totalMoves ? history.totalMoveTime / history.totalMoves : 999999;
  if (avgMove < 600) unlock(ACHIEVEMENTS.find(a => a.id==='move_fast')!);
}

export function noteReplayWatched() { history.replaysWatched++; kv.set(K.HISTORY, history); if (history.replaysWatched >= 10) unlock(ACHIEVEMENTS.find(a => a.id==='spectator_favorite')!); }
export function notePuzzleCompleted(count = 1) { history.puzzlesCompleted += count; kv.set(K.HISTORY, history); if (history.puzzlesCompleted >= 10) unlock(ACHIEVEMENTS.find(a => a.id==='puzzle_master_10')!); if (history.puzzlesCompleted >= 50) unlock(ACHIEVEMENTS.find(a => a.id==='puzzle_master_50')!); }
export function noteThemeEquipped() { history.themesEquipped++; kv.set(K.HISTORY, history); if (history.themesEquipped >= 1) unlock(ACHIEVEMENTS.find(a => a.id==='board_artist')!); }
export function noteCosmeticOwned(total: number) { history.cosmeticsOwned = total; kv.set(K.HISTORY, history); if (total >= 10) unlock(ACHIEVEMENTS.find(a => a.id==='collector_10')!); }

export function trackMove(deltaMs: number) { history.totalMoves++; history.totalMoveTime += deltaMs; kv.set(K.HISTORY, history); }

export function trackGameEnd(outcome: 'win'|'loss'|'draw', ctx: { totalMs: number; moves: number; firstMoveIndex?: number; }) {
  history.games++;
  if (outcome === 'win') { history.wins++; history.winStreak++; history.todayWins++; }
  else if (outcome === 'loss') { history.losses++; history.winStreak = 0; history.todayLosses++; }
  else { history.draws++; }
  if (history.winStreak > history.maxWinStreak) history.maxWinStreak = history.winStreak;
  kv.set(K.HISTORY, history);
  checkAll({ totalMs: ctx.totalMs, moves: ctx.moves, firstMoveIndex: ctx.firstMoveIndex, won: outcome==='win' });
}

