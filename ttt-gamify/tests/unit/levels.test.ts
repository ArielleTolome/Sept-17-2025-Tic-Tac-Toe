import { describe, it, expect } from 'vitest';
import { xpToNext, deriveLevel } from '../../src/core/models/levels';

describe('levels', () => {
  it('xpToNext grows with level', () => {
    expect(xpToNext(1)).toBe(120);
    expect(xpToNext(5)).toBeGreaterThan(xpToNext(2));
  });
  it('deriveLevel computes level and progress', () => {
    const d0 = deriveLevel(0);
    expect(d0.level).toBe(1);
    const d1 = deriveLevel(2000);
    expect(d1.level).toBeGreaterThan(1);
  });
});

