export const CONFIG = {
  DAILY_XP_CAP: Number(import.meta.env.VITE_DAILY_XP_CAP ?? 400),
  DEFAULT_THEME: String(import.meta.env.VITE_DEFAULT_THEME ?? 'dark'),
  SEASON_LENGTH_DAYS: Number(import.meta.env.VITE_SEASON_LENGTH_DAYS ?? 90),
  GAMIFY_API_BASE: (import.meta.env.VITE_GAMIFY_API_BASE as string | undefined) ?? '',
};

