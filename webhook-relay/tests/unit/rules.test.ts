import { describe, expect, test } from 'vitest';
import { parseRules, renderTemplate } from '../../src/relay';

describe('rules', () => {
  test('parse default', () => {
    const r = parseRules({ rules: [{ event: 'start', channels: ['slack'], template: 'Hello {{roomId}}' }] });
    expect(r.rules.length).toBe(1);
  });
  test('render template', () => {
    const s = renderTemplate('Winner {{winner}} in {{roomId}}', { winner: 'X', roomId: 'ROOM' });
    expect(s).toBe('Winner X in ROOM');
  });
});

