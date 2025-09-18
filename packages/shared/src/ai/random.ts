import type { SeededRandom } from '../types';

const DEFAULT_SEED = 'tic-tac-toe';

const stringToSeed = (input: string): number => {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i += 1) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return (h >>> 0) || 1;
};

export const createSeededRandom = (seed: string | number | undefined): SeededRandom => {
  let state = stringToSeed(seed === undefined ? DEFAULT_SEED : String(seed));
  return {
    next(): number {
      state = Math.imul(state ^ (state >>> 15), 1 | state);
      state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
      return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
    },
  };
};
