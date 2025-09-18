import { kv, K } from './storage';
import { startOfDay } from './utils/time';

export type Streak = { days: number; last: number };
let streak: Streak = { days: 0, last: 0 };

export async function loadStreak() {
  streak = await kv.get<Streak>(K.STREAK, { days: 0, last: 0 });
  const today = startOfDay();
  if (streak.last === 0) return kv.set(K.STREAK, streak);
  if (streak.last === today) return;
  const diff = today - streak.last;
  const daysApart = Math.round(diff / 86400000);
  if (daysApart === 1) { streak.days++; streak.last = today; }
  else if (daysApart > 1) { streak.days = 1; streak.last = today; }
  await kv.set(K.STREAK, streak);
}

export function getStreak() { return streak; }

export async function bumpStreakOnPlay() {
  const today = startOfDay();
  if (streak.last !== today) {
    const daysApart = streak.last ? Math.round((today - streak.last)/86400000) : 0;
    if (daysApart === 1) streak.days++; else if (daysApart > 1 || streak.days === 0) streak.days = 1;
    streak.last = today;
    await kv.set(K.STREAK, streak);
  }
}

