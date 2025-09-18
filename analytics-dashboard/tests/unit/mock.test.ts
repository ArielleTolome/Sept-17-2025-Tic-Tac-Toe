import { describe, expect, test } from 'vitest';
import { buildMockAnalytics } from '../../src/server/mock';

describe('mock analytics', () => {
  test('has expected shapes', () => {
    const a = buildMockAnalytics();
    expect(Array.isArray(a.days)).toBe(true);
    expect(a.outcome.some((o: any) => o.label === 'Draw')).toBe(true);
  });
});

