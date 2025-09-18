import { describe, expect, it } from 'vitest';
import {
  applyMove,
  calculateOutcome,
  createEmptyBoard,
  detectWinningLine,
  getAvailableMoves,
  getOpposingPlayer,
  getTurnForBoard,
  isDraw,
} from '../src/game';

describe('game helpers', () => {
  it('creates an empty board', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(9);
    expect(board.every((cell) => cell === null)).toBe(true);
  });

  it('applies moves immutably', () => {
    const board = createEmptyBoard();
    const next = applyMove(board, 4, 'X');
    expect(board[4]).toBeNull();
    expect(next[4]).toBe('X');
  });

  it('throws for illegal moves', () => {
    const board = applyMove(createEmptyBoard(), 0, 'X');
    expect(() => applyMove(board, 0, 'O')).toThrow('Cell 0 is already occupied');
  });

  it('detects winning lines', () => {
    const board = ['X', 'X', 'X', null, null, null, null, null, null] as const;
    const line = detectWinningLine(board);
    expect(line).toEqual({ cells: [0, 1, 2], player: 'X' });
  });

  it('calculates outcome for a win', () => {
    const board = ['O', 'O', 'O', 'X', 'X', null, null, null, null] as const;
    const outcome = calculateOutcome(board);
    expect(outcome.winner).toBe('O');
    expect(outcome.line?.cells).toEqual([0, 1, 2]);
    expect(outcome.isDraw).toBe(false);
  });

  it('calculates outcome for a draw', () => {
    const board = ['O', 'X', 'O', 'O', 'X', 'X', 'X', 'O', 'O'] as const;
    const outcome = calculateOutcome(board);
    expect(outcome.winner).toBeNull();
    expect(outcome.isDraw).toBe(true);
  });

  it('returns next player based on board state', () => {
    const board = ['X', null, null, null, null, null, null, null, null] as const;
    expect(getTurnForBoard(board)).toBe('O');
  });

  it('lists available moves', () => {
    const board = ['X', null, 'O', null, null, null, null, null, null] as const;
    expect(getAvailableMoves(board)).toEqual([1, 3, 4, 5, 6, 7, 8]);
  });

  it('identifies draw boards', () => {
    const board = ['O', 'X', 'O', 'O', 'X', 'X', 'X', 'O', 'O'] as const;
    expect(isDraw(board)).toBe(true);
  });

  it('returns opposing player', () => {
    expect(getOpposingPlayer('X')).toBe('O');
    expect(getOpposingPlayer('O')).toBe('X');
  });
});
