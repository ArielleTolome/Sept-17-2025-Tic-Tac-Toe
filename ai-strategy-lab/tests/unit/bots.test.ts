import { describe, expect, test } from 'vitest';
import { emptyBoard, applyMove } from '../../src/lib/game';
import { HeuristicBot, MinimaxBot, NegaMaxBot, MCTSBot } from '../../src/lib/bots';

describe('bots', () => {
  test('heuristic prefers center', () => {
    const b = emptyBoard();
    const m = HeuristicBot.move(b, 'X');
    expect(m).toBe(4);
  });
  test('minimax picks center first', () => {
    const b = emptyBoard();
    const m = MinimaxBot(9).move(b, 'X');
    expect(m).toBe(4);
  });
  test('negamax picks center first', () => {
    const b = emptyBoard();
    const m = NegaMaxBot(9).move(b, 'X');
    expect(m).toBe(4);
  });
  test('mcts returns a legal move', () => {
    const b = emptyBoard();
    const m = MCTSBot(100).move(b, 'X');
    expect(m).toBeGreaterThanOrEqual(0);
    expect(m).toBeLessThan(9);
  });
});

