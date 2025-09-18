import localforage from 'localforage';

const DB_NAME = 'ttt-gamify';

export async function initStorage() {
  localforage.config({ name: DB_NAME, storeName: 'kv' });
}

export const kv = {
  get: async <T,>(k: string, d: T): Promise<T> => {
    const v = await localforage.getItem<T>(k);
    return v ?? d;
  },
  set: async <T,>(k: string, v: T) => {
    await localforage.setItem<T>(k, v);
    return v;
  },
  remove: async (k: string) => localforage.removeItem(k),
  keys: async () => localforage.keys(),
};

export async function exportPrefs() {
  const keys = await kv.keys();
  const entries: Record<string, any> = {};
  for (const k of keys) entries[k] = await localforage.getItem(k);
  return entries;
}

export async function importPrefs(data: Record<string, any>) {
  for (const [k, v] of Object.entries(data)) await localforage.setItem(k, v);
}

export async function resetPrefs() {
  const keys = await kv.keys();
  await Promise.all(keys.map((k) => localforage.removeItem(k)));
  location.reload();
}

// Namespaced keys
export const K = {
  PROFILE: 'profile',
  XP: 'xp',
  ACH_UNLOCKS: 'ach_unlocks',
  QUESTS: 'quests',
  INVENTORY: 'inventory',
  EQUIPPED: 'equipped',
  STREAK: 'streak',
  HISTORY: 'history',
  LEADERBOARD_LOCAL: 'leaderboard_local',
};

