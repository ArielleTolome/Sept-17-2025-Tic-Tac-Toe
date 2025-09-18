import { kv, K } from '../storage';
import { deriveLevel } from './levels';
import { startOfDay } from '../utils/time';
import { eventBus } from '../events/eventBus';

export type XpState = {
  totalXp: number;
  todayXp: number;
  today: number;
};

const defaults: XpState = { totalXp: 0, todayXp: 0, today: startOfDay() };
let cache: XpState = defaults;

export async function loadXp() {
  const s = await kv.get<XpState>(K.XP, defaults);
  // reset daily if needed
  const sod = startOfDay();
  if (s.today !== sod) { s.today = sod; s.todayXp = 0; }
  cache = s; await kv.set(K.XP, s);
  return s;
}

export function getXp(): XpState { return cache; }

export async function addXp(delta: number) {
  const s = getXp();
  s.totalXp += delta;
  s.todayXp += delta;
  await kv.set(K.XP, s);
  const { level, progress } = deriveLevel(s.totalXp);
  eventBus.emit('SUMMARY_UPDATED');
  return { level, progress, totalXp: s.totalXp };
}

export function xpForOutcome(outcome: 'win_online'|'win_local'|'draw'|'loss', opts: { firstGameOfDay: boolean; totalMs: number; streakBonus: number; cap: number }) {
  let base = 0;
  if (outcome === 'win_online') base = 50;
  if (outcome === 'win_local') base = 30;
  if (outcome === 'draw') base = 20;
  if (outcome === 'loss') base = 10;
  if (opts.firstGameOfDay) base += 25;
  if (opts.totalMs < 30_000) base += 15;
  base += Math.min(25, opts.streakBonus * 5);
  return Math.min(base, opts.cap);
}

