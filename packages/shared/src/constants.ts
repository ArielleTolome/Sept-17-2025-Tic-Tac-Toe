export const BOARD_SIZE = 9;
export const BOARD_DIMENSION = 3;
export const PLAYER_MARKS = ['X', 'O'] as const;
export const WINNING_LINES: readonly (readonly number[])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;
export const MAX_TURNS = BOARD_SIZE;

export const DEFAULT_TURN_TIMER_SECONDS = 10;

export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Impossible = 'impossible',
}

export enum GameMode {
  Single = 'single',
  Local = 'local',
  Online = 'online',
}

export const PRESENCE_TIMEOUT_MS = 12_000;
