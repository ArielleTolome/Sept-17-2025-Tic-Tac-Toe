import type { Server, Socket } from 'socket.io';
import type {
  Board,
  ClientToServerEventMap,
  MoveRecord,
  PlayerMark,
  PlayerSlot,
  PresenceEventPayload,
  ServerToClientEventMap,
  Spectator,
  StateEventPayload,
} from '@tic-tac-toe/shared';
import {
  buildSnapshotFromGame,
  findGameByRoomId,
  recordMessage,
  recordMove,
  recordTimeout,
  resetGameForRematch,
  updateGameWinner,
} from '../services/game-service';
import { calculateOutcome, createEmptyBoard, getOpposingPlayer, sanitizeChatText } from '@tic-tac-toe/shared';
import type { SocketTokenPayload } from '../auth/jwt';
import { env } from '../env';
import { logger } from '../logger';
import { nanoid } from 'nanoid';

interface RoomContext {
  gameId: string;
  roomId: string;
  board: Board;
  turn: PlayerMark;
  status: 'pending' | 'active' | 'finished';
  players: Map<string, PlayerSlot>;
  spectators: Map<string, Spectator>;
  moves: MoveRecord[];
  timer?: NodeJS.Timeout;
  timerExpiresAt?: number;
  rematchVotes: Set<string>;
}

type ApiSocket = Socket<ClientToServerEventMap, ServerToClientEventMap> & {
  data: SocketTokenPayload;
};

export class RoomManager {
  private readonly rooms = new Map<string, RoomContext>();

  constructor(private readonly io: Server<ClientToServerEventMap, ServerToClientEventMap>) {}

  public async ensureRoom(payload: SocketTokenPayload): Promise<RoomContext> {
    const existing = this.rooms.get(payload.roomId);
    if (existing) {
      return existing;
    }

    const game = await findGameByRoomId(payload.roomId);
    if (!game) {
      const context: RoomContext = {
        gameId: payload.gameId,
        roomId: payload.roomId,
        board: createEmptyBoard(),
        turn: 'X',
        status: 'pending',
        players: new Map(),
        spectators: new Map(),
        moves: [],
        rematchVotes: new Set(),
      };
      this.rooms.set(payload.roomId, context);
      return context;
    }

    const snapshot = buildSnapshotFromGame(game);
    const context: RoomContext = {
      gameId: game.id,
      roomId: payload.roomId,
      board: snapshot.board,
      turn: snapshot.turn,
      status: game.status as RoomContext['status'],
      players: new Map(),
      spectators: new Map(),
      moves: snapshot.moves,
      rematchVotes: new Set(),
    };

    this.rooms.set(payload.roomId, context);
    return context;
  }

  public attachSocket = async (socket: ApiSocket, payload: SocketTokenPayload): Promise<void> => {
    const context = await this.ensureRoom(payload);
    socket.data = payload;
    socket.join(payload.roomId);

    context.spectators.delete(payload.sub);

    if (payload.seat !== 'spectator') {
      const existing = context.players.get(payload.sub);
      const entry: PlayerSlot = {
        id: payload.sub,
        name: payload.name ?? existing?.name ?? `Player-${payload.seat}`,
        mark: payload.seat,
        isReady: true,
      };
      context.players.set(payload.sub, entry);
    } else {
      context.spectators.set(payload.sub, {
        id: payload.sub,
        name: payload.name,
      });
    }

    this.emitPresence(context);
    this.emitState(context);
    this.startTurnTimer(context);

    socket.on('move', (data) => this.handleMove(socket, data.index));
    socket.on('chat', (data) => this.handleChat(socket, data.text));
    socket.on('rematch', () => this.handleRematch(socket));
    socket.on('disconnect', () => this.handleDisconnect(socket));
  };

  private handleDisconnect(socket: ApiSocket): void {
    const payload = socket.data;
    const context = this.rooms.get(payload.roomId);
    if (!context) {
      return;
    }

    if (payload.seat === 'spectator') {
      context.spectators.delete(payload.sub);
    } else {
      const player = context.players.get(payload.sub);
      if (player) {
        context.players.set(payload.sub, { ...player, isReady: false });
      }
    }

    this.emitPresence(context);

    const hasReadyPlayer = Array.from(context.players.values()).some((player) => player.isReady);
    if (!hasReadyPlayer && context.spectators.size === 0) {
      this.clearRoom(payload.roomId);
    }
  }

  private clearRoom(roomId: string): void {
    const context = this.rooms.get(roomId);
    if (!context) return;
    if (context.timer) {
      clearTimeout(context.timer);
    }
    this.rooms.delete(roomId);
  }

  private emitPresence(context: RoomContext): void {
    const payload: PresenceEventPayload = {
      players: Array.from(context.players.values()),
      spectators: Array.from(context.spectators.values()),
    };
    this.io.to(context.roomId).emit('presence', payload);
  }

  private emitState(context: RoomContext): void {
    const outcome = calculateOutcome(context.board);
    const payload: StateEventPayload = {
      board: context.board,
      turn: context.turn,
      players: Array.from(context.players.values()),
      spectators: Array.from(context.spectators.values()),
      winner: outcome.winner,
      line: outcome.line ? outcome.line.cells : null,
      moves: context.moves,
      status: context.status,
      timer: context.timerExpiresAt
        ? {
            remainingMs: Math.max(0, context.timerExpiresAt - Date.now()),
            expiresAt: context.timerExpiresAt,
          }
        : undefined,
    };
    this.io.to(context.roomId).emit('state', payload);
  }

  private handleMove(socket: ApiSocket, index: number): void {
    const payload = socket.data;
    const context = this.rooms.get(payload.roomId);
    if (!context) {
      return;
    }

    if (payload.seat === 'spectator') {
      socket.emit('error', { code: 'forbidden', message: 'Spectators cannot play' });
      return;
    }

    if (context.status === 'finished') {
      socket.emit('error', { code: 'finished', message: 'Game already finished' });
      return;
    }

    if (payload.seat !== context.turn) {
      socket.emit('error', { code: 'not_your_turn', message: 'Wait for your turn' });
      return;
    }

    if (index < 0 || index > 8 || context.board[index] !== null) {
      socket.emit('error', { code: 'illegal_move', message: 'Illegal move' });
      return;
    }

    context.board = [...context.board];
    context.board[index] = payload.seat;

    const move: MoveRecord = {
      order: context.moves.length,
      index,
      player: payload.seat,
      timestamp: Date.now(),
    };
    context.moves = [...context.moves, move];

    recordMove(context.gameId, payload.seat, index).catch((error) => {
      logger.error({ error }, 'Failed to persist move');
    });

    const outcome = calculateOutcome(context.board);

    if (outcome.winner || outcome.isDraw) {
      context.status = 'finished';
      context.turn = getOpposingPlayer(payload.seat);
      updateGameWinner(context.gameId, outcome).catch((error) => {
        logger.error({ error }, 'Failed to persist winner');
      });
      this.stopTimer(context);
    } else {
      context.turn = getOpposingPlayer(payload.seat);
      this.startTurnTimer(context);
    }

    this.emitState(context);
  }

  private handleChat(socket: ApiSocket, text: string): void {
    const payload = socket.data;
    const context = this.rooms.get(payload.roomId);
    if (!context) return;

    const clean = sanitizeChatText(text);
    const message = {
      id: nanoid(12),
      name: payload.name ?? 'Anonymous',
      text: clean,
      ts: Date.now(),
    };

    recordMessage(context.gameId, message.name, clean).catch((error) => {
      logger.error({ error }, 'Failed to persist chat message');
    });

    this.io.to(context.roomId).emit('chat', message);
  }

  private handleRematch(socket: ApiSocket): void {
    const payload = socket.data;
    const context = this.rooms.get(payload.roomId);
    if (!context) return;

    if (payload.seat === 'spectator') {
      socket.emit('error', { code: 'forbidden', message: 'Spectators cannot request rematch' });
      return;
    }

    context.rematchVotes.add(payload.sub);
    this.io.to(context.roomId).emit('rematch', { accepted: context.rematchVotes.size >= 2 });

    if (context.rematchVotes.size >= 2) {
      resetGameForRematch(context.gameId)
        .then(() => {
          context.board = createEmptyBoard();
          context.turn = 'X';
          context.status = 'active';
          context.moves = [];
          context.rematchVotes.clear();
          this.emitState(context);
          this.startTurnTimer(context);
        })
        .catch((error) => logger.error({ error }, 'Failed to reset game for rematch'));
    }
  }

  private startTurnTimer(context: RoomContext): void {
    if (context.status !== 'active') {
      this.stopTimer(context);
      return;
    }

    this.stopTimer(context);

    context.timerExpiresAt = Date.now() + env.TURN_TIMEOUT_SECONDS * 1000;
    context.timer = setTimeout(() => {
      this.handleTimeout(context);
    }, env.TURN_TIMEOUT_SECONDS * 1000);
  }

  private stopTimer(context: RoomContext): void {
    if (context.timer) {
      clearTimeout(context.timer);
      context.timer = undefined;
      context.timerExpiresAt = undefined;
    }
  }

  private handleTimeout(context: RoomContext): void {
    const currentPlayer = context.turn;
    context.moves = [
      ...context.moves,
      {
        order: context.moves.length,
        index: -1,
        player: currentPlayer,
        timestamp: Date.now(),
      },
    ];

    recordTimeout(context.gameId, currentPlayer).catch((error) => {
      logger.error({ error }, 'Failed to record timeout');
    });

    context.turn = getOpposingPlayer(currentPlayer);
    this.startTurnTimer(context);
    this.emitState(context);
  }
}
