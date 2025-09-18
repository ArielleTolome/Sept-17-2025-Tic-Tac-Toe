import { describe, expect, test } from 'vitest';

function parseDeepLink(url: string): { type: 'game'; id: string } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (u.protocol.startsWith('ttt') && parts[0] === 'game' && parts[1]) {
      return { type: 'game', id: parts[1] };
    }
  } catch {}
  return null;
}

describe('deep link', () => {
  test('parses ttt://game/:id', () => {
    const p = parseDeepLink('ttt://game/ABC123');
    expect(p).toEqual({ type: 'game', id: 'ABC123' });
  });
  test('rejects invalid', () => {
    expect(parseDeepLink('http://example.com')).toBeNull();
  });
});

