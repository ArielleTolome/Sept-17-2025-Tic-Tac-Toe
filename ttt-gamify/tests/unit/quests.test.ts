import { describe, it, expect, beforeAll } from 'vitest';
import { QUEST_POOL } from '../../src/core/quests/list';
import { mulberry32, seedFromString } from '../../src/core/utils/rng';

describe('quest selection RNG', () => {
  it('seeded RNG produces stable sequence', () => {
    const r1 = mulberry32(seedFromString('abc'))();
    const r2 = mulberry32(seedFromString('abc'))();
    expect(r1).toBeCloseTo(r2);
  });
  it('has daily and weekly pool', () => {
    expect(QUEST_POOL.some(q => q.type==='daily')).toBe(true);
    expect(QUEST_POOL.some(q => q.type==='weekly')).toBe(true);
  });
});

