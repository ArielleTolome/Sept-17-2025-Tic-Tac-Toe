import type { Difficulty, GameMode } from './constants';
import type { MovePayload } from './schemas';

export type PlayerMark = 'X' | 'O';
export type CellValue = PlayerMark | null;
export type Board = readonly CellValue[];

export interface WinningLine {
  cells: readonly number[];
  player: PlayerMark;
}

export interface GameOutcome {
  winner: PlayerMark | null;
  line: WinningLine | null;
  isDraw: boolean;
}

export interface MoveRecord {
  order: number;
  index: number;
  player: PlayerMark;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  name: string;
  text: string;
  timestamp: number;
}

export interface PlayerSlot {
  id: string;
  name: string;
  mark: PlayerMark;
  isReady: boolean;
}

export interface Spectator {
  id: string;
  name?: string;
}

export interface PresenceState {
  players: readonly PlayerSlot[];
  spectators: readonly Spectator[];
}

export interface GameState {
  id: string;
  board: Board;
  turn: PlayerMark;
  status: 'pending' | 'active' | 'finished';
  mode: GameMode;
  winner: PlayerMark | null;
  winningLine: WinningLine | null;
  moves: readonly MoveRecord[];
  createdAt: number;
  updatedAt: number;
  chat: readonly ChatMessage[];
  timer?: {
    remainingMs: number;
    expiresAt: number;
  } | null;
}

export interface TimeTravelEntry {
  index: number;
  board: Board;
  turn: PlayerMark;
  move?: MoveRecord;
}

export interface AiMoveResult {
  index: number;
  score: number;
  depth: number;
}

export interface AiOptions {
  difficulty: Difficulty;
  seed?: string | number;
  randomness?: number;
}

export interface RoomCreateResponse {
  roomId: string;
  wsUrl: string;
  token: string;
}

export interface RoomJoinResponse {
  token: string;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface StateEventPayload {
  board: Board;
  turn: PlayerMark;
  players: readonly PlayerSlot[];
  spectators: readonly Spectator[];
  winner: PlayerMark | null;
  line: readonly number[] | null;
  moves: readonly MoveRecord[];
  status: GameState['status'];
  timer?: GameState['timer'];
}

export interface PresenceEventPayload {
  players: readonly PlayerSlot[];
  spectators: readonly Spectator[];
}

export interface ChatEventPayload {
  id: string;
  name: string;
  text: string;
  ts: number;
}

export interface ErrorEventPayload {
  code: string;
  message: string;
}

export interface RematchEventPayload {
  accepted: boolean;
}

export type ClientToServerEventMap = {
  join: { roomId: string; token: string; name?: string };
  move: MovePayload;
  chat: { text: string };
  rematch: Record<string, never>;
};

export type ServerToClientEventMap = {
  state: StateEventPayload;
  chat: ChatEventPayload;
  presence: PresenceEventPayload;
  error: ErrorEventPayload;
  rematch: RematchEventPayload;
};

export interface SeededRandom {
  next(): number;
}

export type ScoreboardRecord = {
  wins: number;
  losses: number;
  draws: number;
};

export type StoredLocalResult = {
  opponent: string;
  outcome: 'win' | 'loss' | 'draw';
  playedAt: number;
};
