import { beforeEach, describe, expect, it } from 'vitest';

console.log('testPath descriptor', Object.getOwnPropertyDescriptor(expect.getState(), 'testPath'));
import { useLocalGameStore } from '../state/local-game';

const resetStore = () => {
  useLocalGameStore.setState((state) => ({
    ...state,
    mode: 'single',
    board: Array(9).fill(null),
    turn: 'X',
    status: 'idle',
    winner: null,
    winningLine: null,
    history: [{ index: -1, board: Array(9).fill(null), turn: 'X' }],
    pointer: 0,
    moves: [],
    aiThinking: false,
    scoreboard: {
      single: { wins: 0, losses: 0, draws: 0 },
      local: { wins: 0, losses: 0, draws: 0 },
    },
    results: [],
  }));
};

describe('local game store', () => {
  beforeEach(() => {
    resetStore();
  });

  it('records wins for player X in local mode', () => {
    const store = useLocalGameStore.getState();
    store.startLocal();
    store.makeMove(0); // X
    store.makeMove(3); // O
    store.makeMove(1); // X
    store.makeMove(4); // O
    store.makeMove(2); // X wins

    const snapshot = useLocalGameStore.getState();
    expect(snapshot.status).toBe('finished');
    expect(snapshot.winner).toBe('X');
    expect(snapshot.scoreboard.local.wins).toBeGreaterThan(0);
  });

  it('produces draw outcomes when board fills', () => {
    const store = useLocalGameStore.getState();
    store.startLocal();
    [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach((move) => store.makeMove(move));
    const snapshot = useLocalGameStore.getState();
    expect(snapshot.status).toBe('finished');
    expect(snapshot.winner).toBeNull();
    expect(snapshot.scoreboard.local.draws).toBeGreaterThan(0);
  });
});
