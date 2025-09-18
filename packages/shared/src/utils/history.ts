import { applyMove, createEmptyBoard, getOpposingPlayer } from '../game';
import type { MoveRecord, PlayerMark, TimeTravelEntry } from '../types';

export const buildHistory = (moves: readonly MoveRecord[]): TimeTravelEntry[] => {
  const history: TimeTravelEntry[] = [];
  let board = createEmptyBoard();
  let turn: PlayerMark = 'X';
  history.push({ index: -1, board: [...board], turn });

  for (const move of moves) {
    board = applyMove(board, move.index, move.player);
    turn = getOpposingPlayer(move.player);
    history.push({ index: move.index, board: [...board], turn, move });
  }

  return history;
};
