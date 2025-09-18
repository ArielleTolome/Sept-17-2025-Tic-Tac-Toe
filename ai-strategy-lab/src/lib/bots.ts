import type { Board, Player } from './game';
import { availableMoves, applyMove, evaluate, isTerminal, nextPlayer } from './game';

export interface Bot {
  name: string;
  move(board: Board, player: Player): number;
}

export const HeuristicBot: Bot = {
  name: 'heuristic',
  move(board, player) {
    const ms = availableMoves(board);
    // prefer center, then corners, then others
    const order = [4,0,2,6,8,1,3,5,7];
    for (const i of order) if (ms.includes(i)) return i;
    return ms[0];
  }
};

export function MinimaxBot(maxDepth = 9): Bot {
  function minimax(b: Board, me: Player, depth: number, current: Player): { score: number; move: number } {
    if (isTerminal(b) || depth === 0) return { score: evaluate(b, me), move: -1 };
    let bestScore = current === me ? -Infinity : Infinity;
    let bestMove = -1;
    for (const m of availableMoves(b)) {
      const nb = applyMove(b, m, current);
      const { score } = minimax(nb, me, depth - 1, current === 'X' ? 'O' : 'X');
      if (current === me) {
        if (score > bestScore) { bestScore = score; bestMove = m; }
      } else {
        if (score < bestScore) { bestScore = score; bestMove = m; }
      }
    }
    return { score: bestScore, move: bestMove };
  }
  return {
    name: `minimax(d=${maxDepth})`,
    move(board, player) {
      return minimax(board, player, maxDepth, player).move;
    }
  };
}

export function NegaMaxBot(maxDepth = 9): Bot {
  function negamax(b: Board, me: Player, depth: number, current: Player): { score: number; move: number } {
    if (isTerminal(b) || depth === 0) return { score: evaluate(b, me), move: -1 };
    let bestScore = -Infinity;
    let bestMove = -1;
    for (const m of availableMoves(b)) {
      const nb = applyMove(b, m, current);
      const { score } = negamax(nb, me, depth - 1, current === 'X' ? 'O' : 'X');
      const s = -score;
      if (s > bestScore) { bestScore = s; bestMove = m; }
    }
    return { score: bestScore, move: bestMove };
  }
  return {
    name: `negamax(d=${maxDepth})`,
    move(board, player) {
      return negamax(board, player, maxDepth, player).move;
    }
  };
}

export function MCTSBot(iterations = 300): Bot {
  function playout(b: Board, current: Player): number {
    // random playout to terminal; return 1 if win for current player at start, -1 if loss, 0 draw
    let player = current;
    let board = b.slice();
    while (true) {
      if (isTerminal(board)) break;
      const moves = availableMoves(board);
      const pick = moves[Math.floor(Math.random() * moves.length)];
      board = applyMove(board, pick, player);
      player = player === 'X' ? 'O' : 'X';
    }
    // evaluate from perspective of starting current
    const e = evaluate(board, current);
    return e;
  }
  return {
    name: `mcts(n=${iterations})`,
    move(board, player) {
      const moves = availableMoves(board);
      let best = moves[0];
      let bestScore = -Infinity;
      for (const m of moves) {
        let total = 0;
        for (let i = 0; i < iterations / moves.length; i++) {
          const nb = applyMove(board, m, player);
          total += playout(nb, player === 'X' ? 'O' : 'X');
        }
        if (total > bestScore) { bestScore = total; best = m; }
      }
      return best;
    }
  };
}

export function playGame(a: Bot, b: Bot): { winner: Player | 'Draw'; history: Board[] } {
  let board: Board = Array(9).fill('');
  const history: Board[] = [board.slice()];
  let turn: Player = 'X';
  while (true) {
    const bot = turn === 'X' ? a : b;
    const move = bot.move(board, turn);
    board = applyMove(board, move, turn);
    history.push(board.slice());
    const term = require('../lib/game');
    const w = term.winner(board);
    if (w) return { winner: w, history };
    turn = turn === 'X' ? 'O' : 'X';
  }
}

