import { describe, expect, test } from 'vitest';
import { expectedScore, updateElo } from '../../src/server/elo';

describe('elo', () => {
  test('expected symmetric', () => {
    const e = expectedScore(1200, 1200);
    expect(Math.abs(e - 0.5)).toBeLessThan(1e-6);
  });
  test('update moves in right directions', () => {
    const { newA, newB } = updateElo(1000, 1100, 1);
    expect(newA).toBeGreaterThan(1000);
    expect(newB).toBeLessThan(1100);
  });
});

