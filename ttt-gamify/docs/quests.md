# Quests

Daily (3 random) and Weekly (2 random) quests are generated via seeded RNG to ensure consistency per day/week and device.

- Daily examples: Play 2 games, Win with center start, Watch a replay, Finish a puzzle.
- Weekly examples: Win 10 online games, Get 3 clean sweeps.

Rewards grant XP and stars. Progress persists locally and can sync to the Sidecar when an anonymous token is present.

See `src/core/quests/list.ts` and `src/core/quests/engine.ts`.

