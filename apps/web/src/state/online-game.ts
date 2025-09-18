import { create } from 'zustand';
import {
  createEmptyBoard,
  type Board,
  type MoveRecord,
  type PlayerMark,
  type PlayerSlot,
  type Spectator,
  type StateEventPayload,
  type ChatEventPayload,
  type PresenceEventPayload,
} from '@tic-tac-toe/shared';
import { createGameSocket, type GameSocket } from '../services/socket';

export type Seat = 'X' | 'O' | 'spectator';

interface OnlineGameState {
  connection: 'idle' | 'connecting' | 'ready' | 'error';
  gameStatus: 'pending' | 'active' | 'finished';
  board: Board;
  turn: PlayerMark;
  players: PlayerSlot[];
  spectators: Spectator[];
  winner: PlayerMark | null;
  winningLine: number[] | null;
  moves: MoveRecord[];
  chat: ChatEventPayload[];
  timerExpiresAt: number | null;
  error?: string;
  roomId?: string;
  seat: Seat;
  selfId?: string;
  socket?: GameSocket;
  connect: (options: { url: string; token: string; roomId: string; seat: Seat; selfId: string }) => void;
  disconnect: () => void;
  sendMove: (index: number) => void;
  sendChat: (text: string) => void;
  requestRematch: () => void;
  clearError: () => void;
}

const initialState = {
  connection: 'idle' as const,
  gameStatus: 'pending' as const,
  board: createEmptyBoard(),
  turn: 'X' as PlayerMark,
  players: [] as PlayerSlot[],
  spectators: [] as Spectator[],
  winner: null,
  winningLine: null,
  moves: [] as MoveRecord[],
  chat: [] as ChatEventPayload[],
  timerExpiresAt: null,
  seat: 'spectator' as Seat,
  socket: undefined as GameSocket | undefined,
};

export const useOnlineGameStore = create<OnlineGameState>((set, get) => ({
  ...initialState,
  connect: ({ url, token, roomId, seat, selfId }) => {
    const existing = get().socket;
    if (existing) {
      existing.removeAllListeners();
      existing.disconnect();
    }

    const socket = createGameSocket(url, token);

    const safeSet = (partial: Partial<OnlineGameState> | ((state: OnlineGameState) => Partial<OnlineGameState>)) =>
      set(partial as any);

    socket.on('connect', () => {
      safeSet({ connection: 'ready', error: undefined });
    });
    socket.on('disconnect', () => {
      safeSet({ connection: 'connecting' });
    });
    socket.on('connect_error', (error) => {
      safeSet({ connection: 'error', error: error.message });
    });
    socket.on('state', (payload) => handleState(payload, (partial) => safeSet(partial)));
    socket.on('presence', (payload) => handlePresence(payload, (partial) => safeSet(partial)));
    socket.on('chat', (payload) => handleChat(payload, (partial) => safeSet(partial)));
    socket.on('error', (payload) => {
      safeSet({ error: payload.message, connection: 'error' });
    });

    safeSet({
      ...initialState,
      connection: 'connecting',
      roomId,
      seat,
      selfId,
      socket,
    });

    socket.connect();
  },
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({ ...initialState, connection: 'idle', socket: undefined });
  },
  sendMove: (index) => {
    const { socket, connection, seat, turn, gameStatus } = get();
    if (!socket || connection !== 'ready' || seat === 'spectator' || gameStatus === 'finished' || turn !== seat) {
      return;
    }
    socket.emit('move', { index });
  },
  sendChat: (text) => {
    const { socket, connection } = get();
    if (!socket || connection !== 'ready' || !text.trim()) return;
    socket.emit('chat', { text });
  },
  requestRematch: () => {
    const { socket, connection } = get();
    if (!socket || connection !== 'ready') return;
    socket.emit('rematch');
  },
  clearError: () => set({ error: undefined, connection: 'ready' }),
}));
