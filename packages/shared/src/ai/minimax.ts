import { Difficulty } from '../constants';
import {
  applyMove,
  boardToKey,
  calculateOutcome,
  getAvailableMoves,
  getOpposingPlayer,
} from '../game';
import type { AiMoveResult, AiOptions, Board, PlayerMark } from '../types';
import { createSeededRandom } from './random';

const MOVE_ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7];

interface MinimaxResult {
  score: number;
  index: number;
  depth: number;
}

const memo = new Map<string, MinimaxResult>();

const evalKey = (
  board: Board,
  player: PlayerMark,
  current: PlayerMark,
  depth: number,
  maxDepth: number,
): string => `${boardToKey(board)}:${player}:${current}:${depth}:${maxDepth}`;

const evaluateTerminal = (board: Board, player: PlayerMark, depth: number): number => {
  const outcome = calculateOutcome(board);
  if (outcome.winner === player) {
    return 10 - depth;
  }
  if (outcome.winner && outcome.winner !== player) {
    return depth - 10;
  }
  if (outcome.isDraw) {
    return 0;
  }
  return 0;
};

const orderMoves = (available: number[]): number[] => {
  const orderedSet = MOVE_ORDER.filter((index) => available.includes(index));
  const missing = available.filter((index) => !orderedSet.includes(index));
  return [...orderedSet, ...missing];
};

const minimax = (
  board: Board,
  player: PlayerMark,
  current: PlayerMark,
  depth: number,
  alpha: number,
  beta: number,
  maxDepth: number,
): MinimaxResult => {
  const outcomeScore = evaluateTerminal(board, player, depth);
  const outcome = calculateOutcome(board);
  if (outcome.winner || outcome.isDraw) {
    return { score: outcomeScore, index: -1, depth };
  }
  if (maxDepth !== Infinity && depth >= maxDepth) {
    return { score: 0, index: -1, depth };
  }

  const key = evalKey(board, player, current, depth, maxDepth);
  const cached = memo.get(key);
  if (cached) {
    return cached;
  }

  const available = orderMoves(getAvailableMoves(board));

  let bestScore = current === player ? -Infinity : Infinity;
  let bestIndex = available[0] ?? -1;
  let bestDepth = depth;
  let localAlpha = alpha;
  let localBeta = beta;

  for (const index of available) {
    const nextBoard = applyMove(board, index, current);
    const nextPlayer = getOpposingPlayer(current);
    const result = minimax(nextBoard, player, nextPlayer, depth + 1, localAlpha, localBeta, maxDepth);
    if (current === player) {
      if (result.score > bestScore) {
        bestScore = result.score;
        bestIndex = index;
        bestDepth = result.depth;
      }
      localAlpha = Math.max(localAlpha, result.score);
      if (localBeta <= localAlpha) {
        break;
      }
    } else {
      if (result.score < bestScore) {
        bestScore = result.score;
        bestIndex = index;
        bestDepth = result.depth;
      }
      localBeta = Math.min(localBeta, result.score);
      if (localBeta <= localAlpha) {
        break;
      }
    }
  }

  const computed: MinimaxResult = { score: bestScore, index: bestIndex, depth: bestDepth };
  memo.set(key, computed);
  return computed;
};

const chooseRandomMove = (moves: number[], randomness: number, seedKey: string): number => {
  const random = createSeededRandom(seedKey);
  if (randomness <= 0) {
    return moves[0]!;
  }
  const idx = Math.floor(random.next() * moves.length);
  return moves[Math.max(0, Math.min(moves.length - 1, idx))]!;
};

const difficultyDepthMap: Record<Difficulty, number> = {
  [Difficulty.Easy]: 1,
  [Difficulty.Medium]: 4,
  [Difficulty.Impossible]: Infinity,
};

export const getAiMove = (
  board: Board,
  player: PlayerMark,
  options: AiOptions,
): AiMoveResult => {
  const available = getAvailableMoves(board);
  if (available.length === 0) {
    throw new Error('No moves available');
  }

  const seedKey = `${options.seed ?? 'seed'}:${boardToKey(board)}:${player}:${options.difficulty}`;
  const randomness = options.randomness ?? 0.5;

  if (options.difficulty === Difficulty.Easy) {
    const random = createSeededRandom(`${seedKey}:random-roll`);
    if (random.next() < randomness) {
      return {
        index: chooseRandomMove(available, randomness, `${seedKey}:easy`),
        score: 0,
        depth: 0,
      };
    }
  }

  const result = minimax(
    board,
    player,
    player,
    0,
    -Infinity,
    Infinity,
    difficultyDepthMap[options.difficulty],
  );

  if (options.difficulty === Difficulty.Medium && result.index === -1) {
    return {
      index: chooseRandomMove(available, 1, `${seedKey}:fallback`),
      score: 0,
      depth: 0,
    };
  }

  if (result.index === -1) {
    return {
      index: available[0]!,
      score: result.score,
      depth: result.depth,
    };
  }

  return {
    index: result.index,
    score: result.score,
    depth: result.depth,
  };
};

export const clearAiMemo = (): void => {
  memo.clear();
};
