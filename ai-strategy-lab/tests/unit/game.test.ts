import { describe, expect, test } from 'vitest';
import { emptyBoard, applyMove, winner, availableMoves, nextPlayer } from '../../src/lib/game';

describe('game', () => {
  test('empty board has 9 moves', () => {
    const b = emptyBoard();
    expect(availableMoves(b).length).toBe(9);
  });
  test('applyMove and nextPlayer', () => {
    let b = emptyBoard();
    expect(nextPlayer(b)).toBe('X');
    b = applyMove(b, 4, 'X');
    expect(nextPlayer(b)).toBe('O');
  });
  test('winner detection', () => {
    let b = emptyBoard();
    b = applyMove(b, 0, 'X');
    b = applyMove(b, 3, 'O');
    b = applyMove(b, 1, 'X');
    b = applyMove(b, 4, 'O');
    b = applyMove(b, 2, 'X');
    expect(winner(b)).toBe('X');
  });
});

