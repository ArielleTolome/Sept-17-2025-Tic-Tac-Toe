import { describe, expect, test } from 'vitest';
import { z } from 'zod';

// test the summary formatting logic separately
const wsMessageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('state'), payload: z.object({ board: z.array(z.union([z.literal('X'), z.literal('O'), z.literal('')])).length(9), next: z.union([z.literal('X'), z.literal('O')]).optional(), finished: z.boolean().optional(), winner: z.union([z.literal('X'), z.literal('O'), z.literal('Draw')]).optional() }) })
]);

function toSummary(board: (''|'X'|'O')[], next?: 'X'|'O', finished?: boolean, winner?: 'X'|'O'|'Draw') {
  const grid = board.map((c, i) => (i % 3 === 2 ? (c || '·') + '\n' : (c || '·') + ' ')).join('');
  const meta = finished ? `Finished. Winner: ${winner}` : `Next: ${next || 'TBD'}`;
  return '``\n' + grid + '``\n' + meta;
}

describe('ws summary', () => {
  test('formats grid and meta', () => {
    const s = toSummary(['X','','','O','','','','',''], 'X', false);
    expect(s).toContain('X · ·');
    expect(s).toContain('Next: X');
  });
  test('finished shows winner', () => {
    const s = toSummary(['X','X','X','','','','','',''], undefined, true, 'X');
    expect(s).toContain('Finished. Winner: X');
  });
});

