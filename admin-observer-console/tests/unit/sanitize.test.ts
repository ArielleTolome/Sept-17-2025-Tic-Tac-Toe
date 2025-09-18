import { describe, expect, test } from 'vitest';

function sanitizeCSV(s: string) { return '"' + s.replace(/"/g, '""') + '"'; }

describe('csv', () => {
  test('escapes quotes', () => {
    expect(sanitizeCSV('A"B')).toBe('"A""B"');
  });
});

