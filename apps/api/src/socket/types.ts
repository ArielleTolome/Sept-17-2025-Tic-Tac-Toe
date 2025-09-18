import type { ClientToServerEventMap, ServerToClientEventMap } from '@tic-tac-toe/shared';
import type { SocketTokenPayload } from '../auth/jwt';
import type { Server, Socket } from 'socket.io';

type EventArgs<T> = T extends Record<string, never> ? [] : [T];

type ClientEventHandlers = {
  [K in keyof ClientToServerEventMap]: (...args: EventArgs<ClientToServerEventMap[K]>) => void;
};

type ServerEventHandlers = {
  [K in keyof ServerToClientEventMap]: (...args: EventArgs<ServerToClientEventMap[K]>) => void;
};

export type TicTacToeServer = Server<ClientEventHandlers, ServerEventHandlers>;
export type TicTacToeSocket = Socket<ClientEventHandlers, ServerEventHandlers>;
export type AuthenticatedSocket = TicTacToeSocket & { data: SocketTokenPayload };
