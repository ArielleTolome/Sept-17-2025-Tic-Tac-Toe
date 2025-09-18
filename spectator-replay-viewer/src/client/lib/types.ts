export type Player = 'X' | 'O';
export type Cell = '' | Player;

export interface GameMove {
  player: Player;
  index: number; // 0..8
  ts: number; // epoch millis
}

export interface Game {
  id: string;
  startedAt: string; // ISO
  finishedAt: string; // ISO
  winner: 'X' | 'O' | 'Draw';
  moves: GameMove[];
}

