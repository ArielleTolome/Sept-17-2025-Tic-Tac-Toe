import { describe, expect, test } from 'vitest';
import { expectedScore, updateElo } from '../../src/server/elo';

describe('elo', () => {
  test('expected symmetric 1200 vs 1200', () => {
    expect(Math.abs(expectedScore(1200, 1200) - 0.5)).toBeLessThan(1e-6);
  });
  test('update changes ratings appropriately', () => {
    const { newA, newB } = updateElo(1000, 1100, 1);
    expect(newA).toBeGreaterThan(1000);
    expect(newB).toBeLessThan(1100);
  });
});

