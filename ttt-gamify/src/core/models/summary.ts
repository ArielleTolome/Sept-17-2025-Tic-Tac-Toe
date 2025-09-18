import { getXp, loadXp } from './xp';
import { deriveLevel } from './levels';

export type Summary = ReturnType<typeof selectSummary>;

export function selectSummary() {
  const xp = getXp();
  const { level, progress } = deriveLevel(xp.totalXp);
  return { level, progress, totalXp: xp.totalXp };
}

export async function ensureSummaryLoaded() {
  await loadXp();
}

