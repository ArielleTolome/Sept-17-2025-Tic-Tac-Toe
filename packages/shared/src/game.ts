import { BOARD_SIZE, PLAYER_MARKS, WINNING_LINES } from './constants.js';
import type {
  Board,
  CellValue,
  GameOutcome,
  MovePayload,
  MoveRecord,
  PlayerMark,
  WinningLine,
} from './types.js';

export const createEmptyBoard = (): CellValue[] => Array<CellValue>(BOARD_SIZE).fill(null);

export const getAvailableMoves = (board: Board): number[] =>
  board.reduce<number[]>((acc, cell, index) => {
    if (cell === null) {
      acc.push(index);
    }
    return acc;
  }, []);

export const isValidMove = (board: Board, move: MovePayload): boolean =>
  move.index >= 0 && move.index < BOARD_SIZE && board[move.index] === null;

export const applyMove = (board: Board, index: number, player: PlayerMark): CellValue[] => {
  if (board[index] !== null) {
    throw new Error(`Cell ${index} is already occupied`);
  }
  const next = [...board];
  next[index] = player;
  return next;
};

export const detectWinningLine = (board: Board): WinningLine | null => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    const value = board[a];
    if (value && value === board[b] && value === board[c]) {
      return { cells: line, player: value };
    }
  }
  return null;
};

export const isDraw = (board: Board): boolean => board.every((cell) => cell !== null);

export const calculateOutcome = (board: Board): GameOutcome => {
  const winningLine = detectWinningLine(board);
  if (winningLine) {
    return {
      winner: winningLine.player,
      line: winningLine,
      isDraw: false,
    };
  }
  if (isDraw(board)) {
    return { winner: null, line: null, isDraw: true };
  }
  return { winner: null, line: null, isDraw: false };
};

export const getTurnForBoard = (board: Board): PlayerMark => {
  const xCount = board.filter((cell) => cell === 'X').length;
  const oCount = board.filter((cell) => cell === 'O').length;
  return xCount === oCount ? 'X' : 'O';
};

export const moveToRecord = (move: MovePayload, player: PlayerMark, order: number): MoveRecord => ({
  index: move.index,
  player,
  order,
  timestamp: Date.now(),
});

export const getOpposingPlayer = (player: PlayerMark): PlayerMark =>
  player === PLAYER_MARKS[0] ? PLAYER_MARKS[1] : PLAYER_MARKS[0];

export const boardToKey = (board: Board): string => board.map((cell) => cell ?? '_').join('');

export const keyToBoard = (key: string): CellValue[] => {
  if (key.length !== BOARD_SIZE) {
    throw new Error('Invalid board serialization');
  }
  return key.split('').map((char) => {
    if (char === '_') return null;
    if (char === 'X' || char === 'O') return char;
    throw new Error(`Unexpected board token: ${char}`);
  }) as CellValue[];
};

export const getMoveHistory = (moves: readonly MoveRecord[]): string =>
  moves
    .map((move) => `${move.player}${move.index}`)
    .join('-');
