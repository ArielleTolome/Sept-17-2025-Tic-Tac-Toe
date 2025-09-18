import { create } from 'zustand';
import type { Cell, GameMove } from '../lib/types';
import { buildFrames, buildInitialBoard, isValidIndex } from '../lib/replay';

interface ReplayState {
  frames: Cell[][];
  index: number;
  playing: boolean;
  speed: number; // moves per second
  load: (moves: GameMove[]) => void;
  play: () => void;
  pause: () => void;
  seek: (i: number) => void;
  first: () => void;
  prev: () => void;
  next: () => void;
  last: () => void;
  setSpeed: (s: number) => void;
}

export const useReplayStore = create<ReplayState>((set, get) => ({
  frames: [buildInitialBoard()],
  index: 0,
  playing: false,
  speed: 1,
  load: (moves) => set({ frames: buildFrames(moves), index: 0, playing: false }),
  play: () => set({ playing: true }),
  pause: () => set({ playing: false }),
  seek: (i) => {
    const { frames } = get();
    if (isValidIndex(i, frames.length)) set({ index: i });
  },
  first: () => set({ index: 0, playing: false }),
  prev: () => set((s) => ({ index: Math.max(0, s.index - 1) })),
  next: () => set((s) => ({ index: Math.min(s.frames.length - 1, s.index + 1) })),
  last: () => set((s) => ({ index: s.frames.length - 1, playing: false })),
  setSpeed: (speed) => set({ speed })
}));

