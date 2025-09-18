import { useEffect } from 'react';
import { Difficulty, getAiMove } from '@tic-tac-toe/shared';
import { useLocalGameStore } from '../state/local-game';

export const useAiController = () => {
  const {
    mode,
    status,
    turn,
    board,
    difficulty,
    seed,
    aiThinking,
    setAiThinking,
    makeMove,
  } = useLocalGameStore((state) => ({
    mode: state.mode,
    status: state.status,
    turn: state.turn,
    board: state.board,
    difficulty: state.difficulty,
    seed: state.seed,
    aiThinking: state.aiThinking,
    setAiThinking: state.setAiThinking,
    makeMove: state.makeMove,
  }));

  useEffect(() => {
    if (mode !== 'single' || status !== 'inProgress' || turn !== 'O' || aiThinking) {
      return;
    }

    setAiThinking(true);
    const timeout = setTimeout(() => {
      try {
        const result = getAiMove(board, 'O', {
          difficulty,
          seed: seed || undefined,
          randomness: difficulty === Difficulty.Easy ? 0.6 : 0,
        });
        makeMove(result.index);
      } finally {
        setAiThinking(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      setAiThinking(false);
    };
  }, [mode, status, turn, aiThinking, board, difficulty, seed, setAiThinking, makeMove]);
};
