import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { t } from '../i18n';
import { usePreferencesStore } from '../state/preferences';
import { createRoom, joinRoom } from '../services/api';
import { clearRoomToken, listRoomTokens, saveRoomToken } from '../utils/storage';

const WS_BASE = import.meta.env.VITE_WS_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export const OnlineLobby: React.FC = () => {
  const navigate = useNavigate();
  const displayName = usePreferencesStore((state) => state.displayName);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<'create' | 'join' | null>(null);

  const storedRooms = useMemo(() => listRoomTokens(), []);

  const handleCreate = async () => {
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

  const handleJoin = async (event: FormEvent) => {
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
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{t('home.onlineMultiplayer')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {t('game.shareRoom')}. Copy the link below or invite a friend with a room code.
          </p>
        </header>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading === 'create'}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {loading === 'create' ? '…' : t('home.createRoom')}
          </button>
          <form onSubmit={handleJoin} className="flex flex-1 gap-2">
            <label htmlFor="lobby-room-code" className="sr-only">
              {t('home.roomCode')}
            </label>
            <input
              id="lobby-room-code"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
              placeholder="ROOM1234"
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
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
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <p className="font-semibold">Need help?</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Open the room on one device and share the link.</li>
            <li>Keep this tab open while playing; closing ends your session.</li>
            <li>Send your display name so friends recognise you.</li>
          </ul>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-300">Recent rooms</h2>
          {Object.keys(storedRooms).length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-300">No saved rooms yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {Object.entries(storedRooms).map(([id]) => (
                <li key={id} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800 dark:text-slate-200">
                  <Link to={`/online/room/${id}`} className="font-semibold text-brand-600 hover:underline dark:text-brand-300">
                    {id}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      clearRoomToken(id);
                      navigate(0);
                    }}
                    className="text-xs text-slate-500 hover:text-rose-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
};
