import { Router } from 'express';
import { z } from 'zod';
import { sanitizeChatText } from '@tic-tac-toe/shared';
import { asyncHandler } from '../middleware/async-handler';
import { createConflict, createNotFound } from '../errors';
import { createGame, joinGame } from '../services/game-service';
import { signSocketToken } from '../auth/jwt';
import { env } from '../env';
import { nanoid } from 'nanoid';

const router = Router();

const createRoomBody = z.object({
  name: z.string().min(1).max(32).optional(),
});

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const body = createRoomBody.parse(req.body ?? {});
    const roomId = nanoid(10);
    const name = body.name ? sanitizeChatText(body.name, 32) : `Player-${roomId.slice(0, 4)}`;

    const { game, user } = await createGame({
      roomId,
      hostName: name,
    });

    if (!user) {
      throw createConflict('Unable to create host user', 'user_creation_failed');
    }

    const token = signSocketToken({
      sub: user.id,
      roomId,
      gameId: game.id,
      seat: 'X',
      name,
    });

    res.status(201).json({
      roomId,
      wsUrl: `${env.PUBLIC_WS_URL}`,
      token,
    });
  }),
);

const joinRoomSchema = z.object({
  name: z.string().min(1).max(32).optional(),
});

router.post(
  '/:roomId/join',
  asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const body = joinRoomSchema.parse(req.body ?? {});
    const name = body.name ? sanitizeChatText(body.name, 32) : `Guest-${roomId.slice(0, 4)}`;

    const result = await joinGame(roomId, name).catch(() => null);
    if (!result) {
      throw createNotFound('Room not found', 'room_not_found');
    }

    const { game, seat, user } = result;

    const token = signSocketToken({
      sub: user?.id ?? nanoid(12),
      roomId,
      gameId: game.id,
      seat: seat === 'spectator' ? 'spectator' : seat,
      name,
    });

    res.json({ token });
  }),
);

export default router;
