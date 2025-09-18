import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Spectator & Replay Viewer</h1>
      <p>
        Watch live Tic-Tac-Toe games or replay finished matches with a timeline and controls. This
        add-on connects only via the core app HTTP and WebSocket APIs.
      </p>
      <div className="flex gap-4">
        <Link
          to="/spectate"
          className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary-600"
        >
          Live Spectate
        </Link>
        <Link
          to="/replay/DEMO?autoPlay=1"
          className="px-4 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-primary-600"
        >
          Try a Demo Replay
        </Link>
      </div>
      <div className="rounded border border-slate-700 p-4 bg-slate-900/40">
        <h2 className="text-xl font-semibold mb-2">Environment</h2>
        <ul className="list-disc pl-6">
          <li>
            API_BASE_URL: <code>{import.meta.env.VITE_API_BASE_URL || 'not set'}</code>
          </li>
          <li>
            WS_BASE_URL: <code>{import.meta.env.VITE_WS_BASE_URL || 'not set'}</code>
          </li>
        </ul>
      </div>
    </section>
  );
}

