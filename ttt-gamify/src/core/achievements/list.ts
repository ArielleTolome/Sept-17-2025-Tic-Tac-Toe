export type Achievement = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  secret?: boolean;
  rewardXp: number;
  rewardStars?: number;
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', name: 'First Win', desc: 'Win your first game', icon: '🥇', rewardXp: 30 },
  { id: 'ten_wins', name: 'Ten Wins', desc: 'Win 10 games', icon: '🔟', rewardXp: 40 },
  { id: 'hundred_games', name: 'Centurion', desc: 'Play 100 games', icon: '💯', rewardXp: 60 },
  { id: 'unbeaten_5', name: 'On Fire', desc: '5 wins in a row', icon: '🔥', rewardXp: 50, rewardStars: 10 },
  { id: 'speed_runner', name: 'Speed Runner', desc: 'Win in under 20s', icon: '⚡', rewardXp: 35 },
  { id: 'comeback_win', name: 'Comeback Kid', desc: 'Win after being behind', icon: '🔁', rewardXp: 40 },
  { id: 'center_start', name: 'Center Start', desc: 'Start from center', icon: '🎯', rewardXp: 20 },
  { id: 'corner_start', name: 'Corner Start', desc: 'Start from a corner', icon: '◻️', rewardXp: 20 },
  { id: 'block_master', name: 'Block Master', desc: 'Block 3 forks', icon: '🧱', rewardXp: 50 },
  { id: 'perfect_draw_vs_impossible', name: 'Perfect Draw', desc: 'Draw vs. impossible', icon: '🧠', rewardXp: 60, secret: true },
  { id: 'no_mistakes', name: 'No Mistakes', desc: 'No illegal moves tried', icon: '👌', rewardXp: 25 },
  { id: 'friend_match', name: 'Friendly Fire', desc: 'Win vs. a referred player', icon: '🤝', rewardXp: 45 },
  { id: 'streak_7', name: 'Lucky Seven', desc: '7-day streak', icon: '7️⃣', rewardXp: 70, rewardStars: 20 },
  { id: 'streak_30', name: 'Iron Will', desc: '30-day streak', icon: '🏆', rewardXp: 150, rewardStars: 50 },
  { id: 'spectator_favorite', name: 'Spectator Favorite', desc: 'Watch 10 replays', icon: '👀', rewardXp: 25 },
  { id: 'teacher', name: 'Teacher', desc: 'Complete tutorial', icon: '🧑‍🏫', rewardXp: 20 },
  { id: 'puzzle_master_10', name: 'Puzzle Master I', desc: 'Complete 10 puzzles', icon: '🧩', rewardXp: 40 },
  { id: 'puzzle_master_50', name: 'Puzzle Master II', desc: 'Complete 50 puzzles', icon: '🧩', rewardXp: 120 },
  { id: 'clean_sweep', name: 'Clean Sweep', desc: 'Win in 3 moves', icon: '🧹', rewardXp: 50 },
  { id: 'last_move_win', name: 'Clutch', desc: 'Win on your last move', icon: '🎲', rewardXp: 30 },
  { id: 'rematch_accepted', name: 'Rematch!', desc: 'Accept a rematch', icon: '🔄', rewardXp: 20 },
  { id: 'three_wins_one_session', name: 'Triple Threat', desc: '3 wins in a session', icon: '3️⃣', rewardXp: 35 },
  { id: 'night_owl', name: 'Night Owl', desc: 'Win between 1–5am', icon: '🌙', rewardXp: 25 },
  { id: 'early_bird', name: 'Early Bird', desc: 'Win between 6–8am', icon: '🌅', rewardXp: 25 },
  { id: 'social_share_3', name: 'Broadcaster', desc: 'Share 3 cards', icon: '📣', rewardXp: 20 },
  { id: 'hundred_wins', name: 'Champion', desc: 'Win 100 games', icon: '🥇', rewardXp: 200, rewardStars: 100 },
  { id: 'flawless_day', name: 'Flawless Day', desc: 'Win 5 games today without losing', icon: '🛡️', rewardXp: 70 },
  { id: 'draw_10', name: 'Fence Sitter', desc: 'Draw 10 games', icon: '⚖️', rewardXp: 30 },
  { id: 'move_fast', name: 'Lightning Hands', desc: 'Average move < 600ms', icon: '🤚⚡', rewardXp: 45 },
  { id: 'board_artist', name: 'Board Artist', desc: 'Equip a cosmetic theme', icon: '🎨', rewardXp: 15 },
  { id: 'collector_10', name: 'Collector', desc: 'Own 10 cosmetics', icon: '🗃️', rewardXp: 60 },
];

