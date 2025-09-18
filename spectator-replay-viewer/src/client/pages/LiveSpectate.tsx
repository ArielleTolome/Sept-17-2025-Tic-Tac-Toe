import { useEffect, useMemo, useRef, useState } from 'react';
import Board from '../components/Board';
import { wsMessageSchema } from '../lib/zodSchemas';

type Cell = 'X' | 'O' | '';

export default function LiveSpectate() {
  const [roomId, setRoomId] = useState('ROOM-DEMO');
  const [token, setToken] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<{ X?: string; O?: string }>({});
  const [cells, setCells] = useState<Cell[]>(Array(9).fill(''));
  const [lastEvent, setLastEvent] = useState<string>('');

  const wsRef = useRef<WebSocket | null>(null);

  const wsUrl = useMemo(() => import.meta.env.VITE_WS_BASE_URL as string, []);

  function connect() {
    setError(null);
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onopen = () => {
        setConnected(true);
        ws.send(JSON.stringify({ type: 'join', roomId, token }));
      };
      ws.onmessage = (ev) => {
        try {
          const parsed = wsMessageSchema.safeParse(JSON.parse(ev.data));
          if (!parsed.success) return;
          const msg = parsed.data;
          setLastEvent(msg.type);
          if (msg.type === 'state') {
            // state: { board: ("X"|"O"|"")[]; next?: 'X'|'O' }
            const nextCells = msg.payload.board as Cell[];
            setCells(nextCells);
          }
          if (msg.type === 'presence') {
            setPlayers(msg.payload.players);
          }
          if (msg.type === 'error') {
            setError(msg.payload.message);
          }
        } catch (e) {
          // ignore
        }
      };
      ws.onerror = () => setError('WebSocket error');
      ws.onclose = () => setConnected(false);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Live Spectate</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
        onSubmit={(e) => {
          e.preventDefault();
          connect();
        }}
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm">Room ID</span>
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600 focus:outline focus:outline-2 focus:outline-primary-600"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">JWT Token (optional)</span>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="px-3 py-2 rounded bg-slate-800 text-white border border-slate-600 focus:outline focus:outline-2 focus:outline-primary-600"
            placeholder="Paste token if required"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary-600"
          aria-live="polite"
        >
          {connected ? 'Reconnect' : 'Connect'}
        </button>
      </form>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="space-y-2">
          <Board cells={cells} ariaLabel="Live board" />
          <p className="text-sm text-slate-300">Last event: {lastEvent || '—'}</p>
        </div>
        <div className="space-y-2 rounded border border-slate-700 p-3 bg-slate-900/40">
          <h2 className="text-lg font-semibold">Players</h2>
          <dl className="grid grid-cols-3 gap-2">
            <dt className="text-slate-300">X</dt>
            <dd className="col-span-2">{players.X || '—'}</dd>
            <dt className="text-slate-300">O</dt>
            <dd className="col-span-2">{players.O || '—'}</dd>
          </dl>
          {error && (
            <div role="alert" className="text-red-400">
              Error: {error}
            </div>
          )}
          <p className="text-xs text-slate-400">
            Using WS: <code className="break-all">{wsUrl}</code>
          </p>
        </div>
      </div>
    </section>
  );
}

