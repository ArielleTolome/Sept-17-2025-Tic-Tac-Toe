import { describe, expect, it } from 'vitest';
import { Difficulty } from '../src/constants';
import { getAiMove } from '../src/ai/minimax';

const almostWinningBoard = [
  'X',
  'X',
  null,
  'O',
  'O',
  null,
  null,
  null,
  null,
] as const;

describe('AI minimax', () => {
  it('chooses winning move in impossible mode', () => {
    const move = getAiMove(almostWinningBoard, 'X', {
      difficulty: Difficulty.Impossible,
      seed: 'test',
    });
    expect(move.index).toBe(2);
  });

  it('blocks opponent win in medium mode', () => {
    const board = ['O', 'O', null, 'X', null, null, 'X', null, null] as const;
    const move = getAiMove(board, 'X', {
      difficulty: Difficulty.Medium,
      seed: 'defend',
    });
    expect(move.index).toBe(2);
  });

  it('produces deterministic choices with the same seed', () => {
    const board = ['X', null, null, null, 'O', null, null, null, null] as const;
    const first = getAiMove(board, 'X', {
      difficulty: Difficulty.Easy,
      seed: 'repeatable',
      randomness: 0.8,
    });
    const second = getAiMove(board, 'X', {
      difficulty: Difficulty.Easy,
      seed: 'repeatable',
      randomness: 0.8,
    });
    expect(second.index).toBe(first.index);
  });
});
