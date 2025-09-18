import { describe, expect, it } from 'vitest';
import { buildHistory } from '../src/utils/history';

describe('history builder', () => {
  it('creates chronological timeline of moves', () => {
    const history = buildHistory([
      { order: 0, index: 0, player: 'X', timestamp: 0 },
      { order: 1, index: 4, player: 'O', timestamp: 1 },
    ]);
    expect(history).toHaveLength(3);
    expect(history[1]?.board[0]).toBe('X');
    expect(history[2]?.board[4]).toBe('O');
    expect(history[2]?.turn).toBe('X');
  });
});
