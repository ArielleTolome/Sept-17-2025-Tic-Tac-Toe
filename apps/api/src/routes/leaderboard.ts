import { Router } from 'express';
import { asyncHandler } from '../middleware/async-handler';
import { getLeaderboard } from '../services/game-service';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const entries = await getLeaderboard();
    res.json(entries);
  }),
);

export default router;
