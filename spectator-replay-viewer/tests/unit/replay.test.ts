import { applyMove, buildFrames, buildInitialBoard, isValidIndex } from '../../src/client/lib/replay';

describe('replay engine', () => {
  test('initial board is empty', () => {
    const b = buildInitialBoard();
    expect(b).toHaveLength(9);
    expect(b.every((c) => c === '')).toBe(true);
  });

  test('applyMove writes once and does not overwrite', () => {
    const b1 = buildInitialBoard();
    const b2 = applyMove(b1, { player: 'X', index: 0, ts: 0 });
    expect(b2[0]).toBe('X');
    const b3 = applyMove(b2, { player: 'O', index: 0, ts: 1 });
    expect(b3[0]).toBe('X');
  });

  test('buildFrames accumulates states', () => {
    const frames = buildFrames([
      { player: 'X', index: 0, ts: 0 },
      { player: 'O', index: 3, ts: 1 }
    ]);
    expect(frames).toHaveLength(3);
    expect(frames[0][0]).toBe('');
    expect(frames[1][0]).toBe('X');
    expect(frames[2][3]).toBe('O');
  });

  test('isValidIndex checks bounds', () => {
    expect(isValidIndex(0, 3)).toBe(true);
    expect(isValidIndex(2, 3)).toBe(true);
    expect(isValidIndex(3, 3)).toBe(false);
    expect(isValidIndex(-1, 3)).toBe(false);
  });
});

