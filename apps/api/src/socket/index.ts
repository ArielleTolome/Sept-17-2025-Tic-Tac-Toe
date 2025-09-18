import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import type { ClientToServerEventMap, ServerToClientEventMap } from '@tic-tac-toe/shared';
import { verifySocketToken, type SocketTokenPayload } from '../auth/jwt';
import { logger } from '../logger';
import { env } from '../env';
import { RoomManager } from './room-manager';

export const createSocketServer = (httpServer: HttpServer): Server<ClientToServerEventMap, ServerToClientEventMap> => {
  const io = new Server<ClientToServerEventMap, ServerToClientEventMap>(httpServer, {
    cors: {
      origin: env.FRONTEND_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const manager = new RoomManager(io);

  io.use((socket, next) => {
    const token =
      (typeof socket.handshake.auth?.token === 'string' && socket.handshake.auth.token) ||
      (typeof socket.handshake.query?.token === 'string' && socket.handshake.query.token);

    if (!token) {
      next(new Error('Missing token'));
      return;
    }

    try {
      const payload = verifySocketToken(token);
      (socket as typeof socket & { data: SocketTokenPayload }).data = payload;
      next();
    } catch (error) {
      next(error instanceof Error ? error : new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const payload = (socket as typeof socket & { data: SocketTokenPayload }).data;
    manager
      .attachSocket(socket as any, payload)
      .catch((error) => {
        logger.error({ error }, 'Failed to attach socket');
        socket.emit('error', { code: 'connection_failed', message: 'Unable to join room' });
        socket.disconnect(true);
      });
  });

  return io;
};
