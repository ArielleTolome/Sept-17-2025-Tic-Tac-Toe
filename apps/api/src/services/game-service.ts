import { type Game, type Message, type Move, type User } from '@prisma/client';
import {
  applyMove,
  calculateOutcome,
  createEmptyBoard,
  getOpposingPlayer,
  type Board,
  type GameOutcome,
  type MoveRecord,
  type PlayerMark,
} from '@tic-tac-toe/shared';
import { prisma } from '../prisma';

const withRelations = {
  moves: {
    orderBy: {
      order: 'asc' as const,
    },
  },
  messages: {
    orderBy: {
      createdAt: 'asc' as const,
    },
    take: 50,
  },
  playerX: true,
  playerO: true,
};

interface GameWithRelations extends Game {
  moves: Move[];
  messages: Message[];
  playerX: User | null;
  playerO: User | null;
}

export interface CreateGameInput {
  roomId: string;
  hostName: string;
}

export interface JoinGameResult {
  game: GameWithRelations;
  seat: PlayerMark | 'spectator';
  user: User | null;
}

export const createUser = async (name: string): Promise<User> =>
  prisma.user.create({
    data: {
      name,
    },
  });

export const createGame = async ({ roomId, hostName }: CreateGameInput): Promise<{
  game: GameWithRelations;
  user: User;
}> => {
  const user = await createUser(hostName);
  const game = await prisma.game.create({
    data: {
      roomId,
      status: 'pending',
      xUserId: user.id,
    },
    include: withRelations,
  });

  return { game, user };
};

export const findGameByRoomId = async (roomId: string): Promise<GameWithRelations | null> =>
  prisma.game.findUnique({ where: { roomId }, include: withRelations });

export const findGameById = async (id: string): Promise<GameWithRelations | null> =>
  prisma.game.findUnique({ where: { id }, include: withRelations });

export const joinGame = async (roomId: string, name: string): Promise<JoinGameResult> => {
  const game = await findGameByRoomId(roomId);
  if (!game) {
    throw new Error('Game not found');
  }

  if (!game.xUserId) {
    const user = await createUser(name);
    const updated = await prisma.game.update({
      where: { id: game.id },
      data: {
        xUserId: user.id,
        status: 'pending',
      },
      include: withRelations,
    });
    return { game: updated, seat: 'X', user };
  }

  if (!game.oUserId) {
    const user = await createUser(name);
    const updated = await prisma.game.update({
      where: { id: game.id },
      data: {
        oUserId: user.id,
        status: 'active',
      },
      include: withRelations,
    });
    return { game: updated, seat: 'O', user };
  }

  return { game, seat: 'spectator', user: null };
};

export const recordMove = async (
  gameId: string,
  player: PlayerMark,
  index: number,
): Promise<Move> => {
  const order = await prisma.move.count({ where: { gameId } });
  return prisma.move.create({
    data: {
      gameId,
      player,
      index,
      order,
    },
  });
};

export const recordTimeout = async (gameId: string, player: PlayerMark): Promise<Move> => {
  const order = await prisma.move.count({ where: { gameId } });
  return prisma.move.create({
    data: {
      gameId,
      player,
      index: -1,
      order,
    },
  });
};

export const recordMessage = async (gameId: string, name: string, text: string): Promise<Message> =>
  prisma.message.create({
    data: {
      gameId,
      name,
      text,
    },
  });

export const updateGameWinner = async (
  gameId: string,
  outcome: GameOutcome,
): Promise<GameWithRelations> => {
  const winnerSymbol = outcome.winner ?? null;
  return prisma.game.update({
    where: { id: gameId },
    data: {
      status: outcome.isDraw || !winnerSymbol ? 'finished' : 'finished',
      winner: winnerSymbol,
    },
    include: withRelations,
  });
};

export const resetGameForRematch = async (gameId: string): Promise<GameWithRelations> =>
  prisma.game.update({
    where: { id: gameId },
    data: {
      status: 'active',
      winner: null,
      moves: {
        deleteMany: {},
      },
      updatedAt: new Date(),
    },
    include: withRelations,
  });

export interface GameSnapshot {
  board: Board;
  moves: MoveRecord[];
  turn: PlayerMark;
  outcome: GameOutcome;
}

export const buildSnapshotFromGame = (game: GameWithRelations): GameSnapshot => {
  let board = createEmptyBoard();
  const moves: MoveRecord[] = [];

  for (const move of game.moves.sort((a, b) => a.order - b.order)) {
    if (move.index >= 0) {
      board = applyMove(board, move.index, move.player as PlayerMark);
    }
    moves.push({
      order: move.order,
      index: move.index,
      player: move.player as PlayerMark,
      timestamp: move.createdAt.getTime(),
    });
  }

  const xCount = board.filter((cell) => cell === 'X').length;
  const oCount = board.filter((cell) => cell === 'O').length;
  const turn: PlayerMark = xCount === oCount ? 'X' : 'O';
  const outcome = calculateOutcome(board);

  return {
    board,
    moves,
    turn: outcome.winner ? getOpposingPlayer(outcome.winner) : turn,
    outcome,
  };
};

export interface LeaderboardEntry {
  userId: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const games = await prisma.game.findMany({
    include: {
      playerX: true,
      playerO: true,
    },
    take: 200,
  });

  const stats = new Map<string, LeaderboardEntry>();

  for (const game of games) {
    const { winner, playerX, playerO } = game;
    const ensure = (user: User | null): LeaderboardEntry | null => {
      if (!user) return null;
      if (!stats.has(user.id)) {
        stats.set(user.id, {
          userId: user.id,
          name: user.name,
          wins: 0,
          losses: 0,
          draws: 0,
          winRate: 0,
        });
      }
      return stats.get(user.id) ?? null;
    };

    const x = ensure(playerX);
    const o = ensure(playerO);

    if (winner === 'X') {
      if (x) x.wins += 1;
      if (o) o.losses += 1;
    } else if (winner === 'O') {
      if (o) o.wins += 1;
      if (x) x.losses += 1;
    } else {
      if (x) x.draws += 1;
      if (o) o.draws += 1;
    }
  }

  for (const entry of stats.values()) {
    const gamesPlayed = entry.wins + entry.losses + entry.draws;
    entry.winRate = gamesPlayed === 0 ? 0 : entry.wins / gamesPlayed;
  }

  return Array.from(stats.values())
    .filter((entry) => entry.wins + entry.losses + entry.draws > 0)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 20);
};
