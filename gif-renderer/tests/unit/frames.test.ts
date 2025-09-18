import { describe, expect, test } from 'vitest';

function buildFrames(moves: { player: 'X'|'O', index: number }[]) {
  const frames: ((''|'X'|'O')[])[] = [Array(9).fill('')];
  let cur = frames[0].slice();
  for (const m of moves) { cur = cur.slice(); cur[m.index] = m.player; frames.push(cur.slice()); }
  return frames;
}

describe('frames', () => {
  test('accumulate', () => {
    const f = buildFrames([{player:'X', index:0},{player:'O', index:3}]);
    expect(f.length).toBe(3);
    expect(f[1][0]).toBe('X');
    expect(f[2][3]).toBe('O');
  });
});

