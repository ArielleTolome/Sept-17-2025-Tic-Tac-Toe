import type { Cell, Game, GameMove } from './types';

export function buildInitialBoard(): Cell[] {
  return Array<Cell>(9).fill('');
}

export function applyMove(board: Cell[], move: GameMove): Cell[] {
  if (move.index < 0 || move.index > 8) return board.slice();
  if (board[move.index] !== '') return board.slice();
  const next = board.slice();
  next[move.index] = move.player;
  return next;
}

export function buildFrames(moves: GameMove[]): Cell[][] {
  const frames: Cell[][] = [buildInitialBoard()];
  let cur = frames[0];
  for (const m of moves) {
    cur = applyMove(cur, m);
    frames.push(cur);
  }
  return frames;
}

export function isValidIndex(i: number, length: number): boolean {
  return Number.isInteger(i) && i >= 0 && i < length;
}

export type { Game };

