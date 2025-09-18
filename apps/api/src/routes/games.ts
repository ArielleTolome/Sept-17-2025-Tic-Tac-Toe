import { Router } from 'express';
import { buildSnapshotFromGame, findGameById } from '../services/game-service';
import { createNotFound } from '../errors';
import { asyncHandler } from '../middleware/async-handler';

const router = Router();

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const game = await findGameById(id);
    if (!game) {
      throw createNotFound('Game not found', 'game_not_found');
    }

    const snapshot = buildSnapshotFromGame(game);

    res.json({
      id: game.id,
      board: snapshot.board,
      turn: snapshot.turn,
      status: game.status,
      mode: 'online',
      winner: snapshot.outcome.winner,
      winningLine: snapshot.outcome.line,
      moves: snapshot.moves,
      createdAt: game.createdAt.getTime(),
      updatedAt: game.updatedAt.getTime(),
      chat: game.messages.map((message) => ({
        id: message.id,
        name: message.name,
        text: message.text,
        timestamp: message.createdAt.getTime(),
      })),
      timer: null,
    });
  }),
);

export default router;
