import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  applyMove,
  calculateOutcome,
  createEmptyBoard,
  getOpposingPlayer,
  type Board,
  type GameOutcome,
  type MoveRecord,
  type PlayerMark,
  type ScoreboardRecord,
  type StoredLocalResult,
  type TimeTravelEntry,
  Difficulty,
} from '@tic-tac-toe/shared';

export type LocalMode = 'single' | 'local';

interface StoredResult extends StoredLocalResult {
  mode: LocalMode;
}

interface LocalGameState {
  mode: LocalMode;
  board: Board;
  turn: PlayerMark;
  status: 'idle' | 'inProgress' | 'finished';
  difficulty: Difficulty;
  seed: string;
  winner: PlayerMark | null;
  winningLine: number[] | null;
  history: TimeTravelEntry[];
  pointer: number;
  moves: MoveRecord[];
  aiThinking: boolean;
  scoreboard: Record<LocalMode, ScoreboardRecord>;
  results: StoredResult[];
  startSingle: (difficulty: Difficulty, seed?: string) => void;
  startLocal: () => void;
  makeMove: (index: number) => void;
  jumpTo: (pointer: number) => void;
  reset: () => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setSeed: (seed: string) => void;
  setAiThinking: (value: boolean) => void;
}

const makeStorage = () =>
  createJSONStorage<LocalGameState>(() => {
    if (typeof window === 'undefined') {
      const memory: Record<string, string> = {};
      return {
        getItem: (name) => memory[name] ?? null,
        setItem: (name, value) => {
          memory[name] = value;
        },
        removeItem: (name) => {
          delete memory[name];
        },
      } as Storage;
    }
    return window.localStorage;
  });

const initialHistory = (): TimeTravelEntry[] => [
  { index: -1, board: createEmptyBoard(), turn: 'X' },
];

const emptyScoreboard = (): Record<LocalMode, ScoreboardRecord> => ({
  single: { wins: 0, losses: 0, draws: 0 },
  local: { wins: 0, losses: 0, draws: 0 },
});

const updateScoreboard = (
  current: Record<LocalMode, ScoreboardRecord>,
  mode: LocalMode,
  outcome: GameOutcome,
): Record<LocalMode, ScoreboardRecord> => {
  const next = { ...current, [mode]: { ...current[mode] } };
  if (outcome.winner === 'X') {
    next[mode].wins += 1;
  } else if (outcome.winner === 'O') {
    next[mode].losses += 1;
  } else {
    next[mode].draws += 1;
  }
  return next;
};

export const useLocalGameStore = create<LocalGameState>()(
  persist(
    (set, get) => ({
      mode: 'single',
      board: createEmptyBoard(),
      turn: 'X',
      status: 'idle',
      difficulty: Difficulty.Medium,
      seed: '',
      winner: null,
      winningLine: null,
      history: initialHistory(),
      pointer: 0,
      moves: [],
      aiThinking: false,
      scoreboard: emptyScoreboard(),
      results: [],
      startSingle: (difficulty, seed = '') => {
        set({
          mode: 'single',
          difficulty,
          seed,
          board: createEmptyBoard(),
          turn: 'X',
          status: 'inProgress',
          winner: null,
          winningLine: null,
          history: initialHistory(),
          pointer: 0,
          moves: [],
          aiThinking: false,
        });
      },
      startLocal: () => {
        set({
          mode: 'local',
          board: createEmptyBoard(),
          turn: 'X',
          status: 'inProgress',
          winner: null,
          winningLine: null,
          history: initialHistory(),
          pointer: 0,
          moves: [],
          aiThinking: false,
        });
      },
      makeMove: (index) => {
        const state = get();
        if (state.status !== 'inProgress') return;

        const trimmedHistory = state.history.slice(0, state.pointer + 1);
        const trimmedMoves = state.moves.slice(0, Math.max(0, state.pointer));
        const currentEntry = trimmedHistory.at(-1);
        if (!currentEntry) return;

        const currentBoard = currentEntry.board;
        if (currentBoard[index] !== null) return;

        const player = currentEntry.turn;
        const nextBoard = applyMove(currentBoard, index, player);
        const nextTurn = getOpposingPlayer(player);
        const moveRecord: MoveRecord = {
          order: trimmedMoves.length,
          index,
          player,
          timestamp: Date.now(),
        };

        const nextHistory: TimeTravelEntry[] = [
          ...trimmedHistory,
          { index, board: nextBoard, turn: nextTurn, move: moveRecord },
        ];
        const moves = [...trimmedMoves, moveRecord];
        const outcome = calculateOutcome(nextBoard);
        const winningLine = outcome.line?.cells ?? null;
        const winner = outcome.winner ?? null;
        const status = outcome.winner || outcome.isDraw ? 'finished' : 'inProgress';

        set((prev) => ({
          board: nextBoard,
          turn: nextTurn,
          history: nextHistory,
          pointer: nextHistory.length - 1,
          moves,
          winningLine,
          winner,
          status,
          scoreboard:
            status === 'finished' ? updateScoreboard(prev.scoreboard, prev.mode, outcome) : prev.scoreboard,
          results:
            status === 'finished' && prev.mode === 'local'
              ? [
                  {
                    mode: prev.mode,
                    opponent: 'Player O',
                    outcome:
                      outcome.winner === 'X'
                        ? 'win'
                        : outcome.winner === 'O'
                        ? 'loss'
                        : 'draw',
                    playedAt: Date.now(),
                  },
                  ...prev.results,
                ].slice(0, 5)
              : prev.results,
        }));
      },
      jumpTo: (pointer) => {
        const state = get();
        if (pointer < 0 || pointer >= state.history.length) return;
        const entry = state.history[pointer];
        set({
          pointer,
          board: entry.board,
          turn: entry.turn,
        });
      },
      reset: () => {
        const state = get();
        if (state.mode === 'single') {
          state.startSingle(state.difficulty, state.seed);
        } else {
          state.startLocal();
        }
      },
      setDifficulty: (difficulty) => set({ difficulty }),
      setSeed: (seed) => set({ seed }),
      setAiThinking: (value) => set({ aiThinking: value }),
    }),
    {
      name: 'ttt-local-game',
      storage: makeStorage(),
      partialize: (state) => ({
        scoreboard: state.scoreboard,
        results: state.results,
        difficulty: state.difficulty,
        seed: state.seed,
      }),
    },
  ),
);
