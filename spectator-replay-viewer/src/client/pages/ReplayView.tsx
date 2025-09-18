import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Board from '../components/Board';
import { buildInitialBoard, type Game } from '../lib/replay';
import { gameSchema } from '../lib/zodSchemas';
import { useReplayStore } from '../state/replayStore';

export default function ReplayView() {
  const { gameId } = useParams();
  const [search] = useSearchParams();
  const autoPlay = search.get('autoPlay') === '1';

  const [game, setGame] = useState<Game | null>(null);
  const frames = useReplayStore((s) => s.frames);
  const index = useReplayStore((s) => s.index);
  const playing = useReplayStore((s) => s.playing);
  const speed = useReplayStore((s) => s.speed);
  const load = useReplayStore((s) => s.load);
  const play = useReplayStore((s) => s.play);
  const pause = useReplayStore((s) => s.pause);
  const first = useReplayStore((s) => s.first);
  const prev = useReplayStore((s) => s.prev);
  const next = useReplayStore((s) => s.next);
  const last = useReplayStore((s) => s.last);
  const setSpeed = useReplayStore((s) => s.setSpeed);
  const setGameLocal = (g: Game | null) => setGame(g);
  const timerRef = useRef<number | null>(null);
  const apiBase = useMemo(() => import.meta.env.VITE_API_BASE_URL as string, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setGameLocal(null);
      load([]);
      if (!gameId) return;
      const res = await fetch(`${apiBase}/api/games/${encodeURIComponent(gameId)}`);
      const json = await res.json();
      const parsed = gameSchema.safeParse(json);
      if (!parsed.success) return;
      if (cancelled) return;
      setGameLocal(parsed.data);
      load(parsed.data.moves);
      if (autoPlay) play();
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [apiBase, gameId, autoPlay]);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = window.setInterval(() => {
      next();
    }, 1000 / Math.max(0.25, speed));
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [playing, frames.length, speed, next]);

  const cells = frames[index] ?? buildInitialBoard();

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Replay</h1>
        <div className="text-sm text-slate-300">Game ID: {gameId}</div>
      </header>
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Board cells={cells} ariaLabel="Replay board" />
        <div className="space-y-3 rounded border border-slate-700 p-3 bg-slate-900/40">
          <Controls
            index={index}
            length={frames.length}
            playing={playing}
            speed={speed}
            onPlayPause={() => (playing ? pause() : play())}
            onFirst={first}
            onPrev={prev}
            onNext={next}
            onLast={last}
            onSeek={(v) => useReplayStore.getState().seek(v)}
            onSpeed={(s) => setSpeed(s)}
          />
          <Meta game={game} />
        </div>
      </div>
    </section>
  );
}

function Controls(props: {
  index: number;
  length: number;
  playing: boolean;
  speed: number;
  onPlayPause: () => void;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onSeek: (v: number) => void;
  onSpeed: (s: number) => void;
}) {
  const { index, length, playing, speed } = props;
  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center" role="group" aria-label="Playback controls">
        <button className="btn" onClick={props.onFirst} aria-label="First move">
          ⏮️
        </button>
        <button className="btn" onClick={props.onPrev} aria-label="Previous move">
          ◀️
        </button>
        <button className="btn" onClick={props.onPlayPause} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? '⏸️' : '▶️'}
        </button>
        <button className="btn" onClick={props.onNext} aria-label="Next move">
          ▶️
        </button>
        <button className="btn" onClick={props.onLast} aria-label="Last move">
          ⏭️
        </button>
      </div>
      <label className="flex items-center gap-2">
        <span className="text-sm w-24">Move {index}</span>
        <input
          type="range"
          min={0}
          max={Math.max(0, length - 1)}
          value={index}
          onChange={(e) => props.onSeek(e.currentTarget.valueAsNumber)}
          className="w-full"
        />
        <span className="text-sm w-16 text-right">{length - 1}</span>
      </label>
      <label className="flex items-center gap-2">
        <span className="text-sm w-24">Speed</span>
        <select
          value={speed}
          onChange={(e) => props.onSpeed(Number(e.currentTarget.value))}
          className="px-2 py-1 rounded bg-slate-800 border border-slate-600"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={4}>4x</option>
        </select>
      </label>
    </div>
  );
}

function Meta({ game }: { game: Game | null }) {
  if (!game) return <p className="text-slate-300">Loading…</p>;
  return (
    <dl className="grid grid-cols-3 gap-2">
      <dt className="text-slate-300">Started</dt>
      <dd className="col-span-2">{new Date(game.startedAt).toLocaleString()}</dd>
      <dt className="text-slate-300">Finished</dt>
      <dd className="col-span-2">{new Date(game.finishedAt).toLocaleString()}</dd>
      <dt className="text-slate-300">Winner</dt>
      <dd className="col-span-2">{game.winner}</dd>
      <dt className="text-slate-300">Moves</dt>
      <dd className="col-span-2">{game.moves.length}</dd>
    </dl>
  );
}
