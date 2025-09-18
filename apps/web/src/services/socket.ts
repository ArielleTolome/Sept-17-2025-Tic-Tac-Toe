import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEventMap, ServerToClientEventMap } from '@tic-tac-toe/shared';

export type GameSocket = Socket<ServerToClientEventMap, ClientToServerEventMap>;

export const createGameSocket = (url: string, token: string): GameSocket =>
  io(url, {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 500,
    reconnectionDelayMax: 2_500,
    withCredentials: true,
    auth: { token },
  });
