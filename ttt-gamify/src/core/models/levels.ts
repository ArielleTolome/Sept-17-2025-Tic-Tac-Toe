export function xpToNext(level: number) {
  return 120 + Math.round(45 * Math.pow(level - 1, 1.15));
}

export function deriveLevel(totalXp: number) {
  let level = 1;
  let remaining = totalXp;
  while (level < 50) {
    const need = xpToNext(level);
    if (remaining < need) break;
    remaining -= need;
    level++;
  }
  const need = xpToNext(level);
  const progress = Math.max(0, Math.min(1, remaining / need));
  return { level, progress };
}

