import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEventMap, ServerToClientEventMap } from '@tic-tac-toe/shared';

type EventArgs<T> = T extends Record<string, never> ? [] : [T];
type EventHandlerMap<T extends Record<string, unknown>> = {
  [K in keyof T]: (...args: EventArgs<T[K]>) => void;
};

export type GameSocket = Socket<EventHandlerMap<ServerToClientEventMap>, EventHandlerMap<ClientToServerEventMap>>;

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
