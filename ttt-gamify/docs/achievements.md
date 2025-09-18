# Achievements

Each achievement defines: id, name, description, icon, secret?, reward XP and optional stars. Criteria are evaluated from the event stream derived at runtime from the host DOM.

- first_win: Win your first game
- ten_wins: Win 10 games
- hundred_games: Play 100 games
- unbeaten_5: 5 wins in a row
- speed_runner: Win under 20s
- comeback_win: Win after being behind
- center_start: Start from the center
- corner_start: Start from a corner
- block_master: Block 3 forks
- perfect_draw_vs_impossible: Draw vs. impossible AI
- no_mistakes: No illegal moves attempted
- friend_match: Win vs. referred player
- streak_7: 7-day streak
- streak_30: 30-day streak
- spectator_favorite: Watch 10 replays
- teacher: Completed tutorial
- puzzle_master_10: Complete 10 puzzles
- puzzle_master_50: Complete 50 puzzles
- clean_sweep: Win with 3 moves
- last_move_win: Win on last move
- rematch_accepted: Accept a rematch
- three_wins_one_session: 3 wins in one session
- night_owl: Win between 1–5am
- early_bird: Win between 6–8am
- social_share_3: Share 3 cards
- hundred_wins: Win 100 games
- flawless_day: 5 wins today without losing
- draw_10: Draw 10 games
- move_fast: Average move < 600ms
- board_artist: Equip a cosmetic theme
- collector_10: Own 10 cosmetics

See `src/core/achievements/list.ts` and `src/core/achievements/engine.ts`.

