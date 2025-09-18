import { describe, it, expect } from 'vitest';
import { xpForOutcome } from '../../src/core/models/xp';

describe('xp ledger', () => {
  it('awards more for online win', () => {
    const base = { firstGameOfDay: false, totalMs: 60000, streakBonus: 0, cap: 400 };
    expect(xpForOutcome('win_online', base)).toBeGreaterThan(xpForOutcome('win_local', base));
  });
  it('awards quick win bonus', () => {
    const a = xpForOutcome('win_local', { firstGameOfDay: false, totalMs: 10_000, streakBonus: 0, cap: 400 });
    const b = xpForOutcome('win_local', { firstGameOfDay: false, totalMs: 60_000, streakBonus: 0, cap: 400 });
    expect(a).toBeGreaterThan(b);
  });
});

