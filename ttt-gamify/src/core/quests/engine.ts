import { kv, K } from '../storage';
import { QUEST_POOL, Quest } from './list';
import { seedFromString, mulberry32 } from '../utils/rng';
import { startOfDay } from '../utils/time';
import { addXp } from '../models/xp';
import { eventBus } from '../events/eventBus';

export type ActiveQuest = Quest & { progress: number; claimable: boolean };
type QuestState = { lastDaily: number; lastWeekly: number; actives: ActiveQuest[] };

const defaults: QuestState = { lastDaily: 0, lastWeekly: 0, actives: [] };
let state: QuestState = defaults;

export async function loadQuests() {
  state = await kv.get<QuestState>(K.QUESTS, defaults);
  ensureGenerated();
}

function ensureGenerated() {
  const today = startOfDay();
  const week = today - ((new Date().getDay() + 6) % 7) * 86400000; // Monday-based week start

  let changed = false;
  if (state.lastDaily !== today) {
    state.actives = [
      ...pickN(QUEST_POOL.filter(q => q.type==='daily'), 3, 'daily-'+today)
        .map(q => ({ ...q, progress: 0, claimable: false })),
      ...state.actives.filter(a => a.type==='weekly')
    ];
    state.lastDaily = today; changed = true;
  }
  if (state.lastWeekly !== week) {
    state.actives = [
      ...state.actives.filter(a => a.type==='daily'),
      ...pickN(QUEST_POOL.filter(q => q.type==='weekly'), 2, 'weekly-'+week)
        .map(q => ({ ...q, progress: 0, claimable: false })),
    ];
    state.lastWeekly = week; changed = true;
  }
  if (changed) kv.set(K.QUESTS, state);
}

function pickN<T>(arr: T[], n: number, seedKey: string) {
  const rng = mulberry32(seedFromString(seedKey));
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(rng() * copy.length), 1)[0]);
  }
  return out;
}

export function getActiveQuests(): ActiveQuest[] { ensureGenerated(); return state.actives; }

export function progressQuest(id: string, delta = 1) {
  const q = state.actives.find(a => a.id === id);
  if (!q) return;
  q.progress = Math.min(q.target, q.progress + delta);
  q.claimable = q.progress >= q.target;
  kv.set(K.QUESTS, state);
}

export async function claimQuest(id: string) {
  const q = state.actives.find(a => a.id === id);
  if (!q || !q.claimable) return;
  q.claimable = false; // prevent double claim
  await addXp(q.rewardXp);
  eventBus.emit('TOAST', { id: 'quest-'+id+'-'+Date.now(), text: `Quest complete: ${q.name} (+${q.rewardXp} XP, +${q.rewardStars}★)` });
  kv.set(K.QUESTS, state);
}

