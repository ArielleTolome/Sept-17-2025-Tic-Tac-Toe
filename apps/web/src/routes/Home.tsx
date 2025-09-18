import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DifficultySelector } from '../components/DifficultySelector';
import { RecentResults } from '../components/RecentResults';
import { Scoreboard } from '../components/Scoreboard';
import { t } from '../i18n';
import { useLocalGameStore } from '../state/local-game';
import { usePreferencesStore } from '../state/preferences';
import { createRoom, joinRoom } from '../services/api';
import { saveRoomToken } from '../utils/storage';

const WS_BASE = import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const difficulty = useLocalGameStore((state) => state.difficulty);
  const scoreboard = useLocalGameStore((state) => state.scoreboard);
  const results = useLocalGameStore((state) => state.results);
  const setDifficulty = useLocalGameStore((state) => state.setDifficulty);
  const displayName = usePreferencesStore((state) => state.displayName);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'create' | 'join' | null>(null);

  const startSinglePlayer = () => {
    setDifficulty(selectedDifficulty);
    navigate('/play/single', { replace: false, state: { difficulty: selectedDifficulty } });
  };

  const startLocalMultiplayer = () => {
    navigate('/play/local');
  };

  const handleCreateRoom = async () => {
    setLoading('create');
    setError(null);
    try {
      const response = await createRoom(displayName);
      saveRoomToken(response.roomId, { token: response.token, wsUrl: response.wsUrl ?? WS_BASE });
      navigate(`/online/room/${response.roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.unknown'));
    } finally {
      setLoading(null);
    }
  };

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault();
    if (!roomCode.trim()) {
      setError(t('validation.invalidRoom'));
      return;
    }
    setLoading('join');
    setError(null);
    try {
      const response = await joinRoom(roomCode.trim(), displayName);
      saveRoomToken(roomCode.trim(), { token: response.token, wsUrl: WS_BASE });
      navigate(`/online/room/${roomCode.trim()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errors.unknown'));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50 via-white to-white p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('app.name')}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{t('home.tagline')}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100">{t('home.singlePlayer')}</h2>
            <DifficultySelector value={selectedDifficulty} onChange={setSelectedDifficulty} />
            <button
              type="button"
              onClick={startSinglePlayer}
              className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              {t('home.startGame')}
            </button>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100">{t('home.localMultiplayer')}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">Two players share one device and take turns.</p>
            <button
              type="button"
              onClick={startLocalMultiplayer}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t('home.startGame')}
            </button>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100">{t('home.onlineMultiplayer')}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">Share a room link or enter a code to connect instantly.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCreateRoom}
              disabled={loading === 'create'}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              {loading === 'create' ? '…' : t('home.createRoom')}
            </button>
            <form onSubmit={handleJoinRoom} className="flex flex-1 gap-2">
              <label htmlFor="room-code" className="sr-only">
                {t('home.roomCode')}
              </label>
              <input
                id="room-code"
                value={roomCode}
                onChange={(event) => setRoomCode(event.target.value)}
                placeholder="ROOM1234"
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={loading === 'join'}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {loading === 'join' ? '…' : t('home.join')}
              </button>
            </form>
          </div>
          {error ? <p className="text-sm text-rose-500" role="alert">{error}</p> : null}
        </div>
      </section>

      <aside className="space-y-4">
        <Scoreboard title={t('home.singlePlayer')} record={scoreboard.single} />
        <Scoreboard title={t('home.localMultiplayer')} record={scoreboard.local} />
        <RecentResults results={results} />
      </aside>
    </div>
  );
};
