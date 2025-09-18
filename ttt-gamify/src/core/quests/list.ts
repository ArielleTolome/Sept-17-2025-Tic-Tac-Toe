export type Quest = {
  id: string;
  type: 'daily'|'weekly';
  name: string;
  desc: string;
  target: number;
  rewardXp: number;
  rewardStars: number;
};

export const QUEST_POOL: Quest[] = [
  { id: 'play_2', type: 'daily', name: 'Warmup', desc: 'Play 2 games', target: 2, rewardXp: 40, rewardStars: 10 },
  { id: 'center_win', type: 'daily', name: 'Bullseye', desc: 'Win with center start', target: 1, rewardXp: 50, rewardStars: 10 },
  { id: 'watch_replay', type: 'daily', name: 'Student', desc: 'Watch a replay', target: 1, rewardXp: 30, rewardStars: 8 },
  { id: 'finish_puzzle', type: 'daily', name: 'Thinker', desc: 'Finish a puzzle', target: 1, rewardXp: 40, rewardStars: 8 },
  { id: 'win_5', type: 'weekly', name: 'On a Roll', desc: 'Win 10 online games', target: 10, rewardXp: 180, rewardStars: 50 },
  { id: 'clean_sweeps', type: 'weekly', name: 'Sweep Squad', desc: 'Get 3 clean sweeps', target: 3, rewardXp: 120, rewardStars: 40 },
];

