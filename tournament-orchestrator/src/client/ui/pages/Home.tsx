import useSWR from './useSWRLite';
import { Link } from 'react-router-dom';

export default function Home() {
  const { data } = useSWR('/api/tournaments');
  const list: any[] = data?.tournaments || [];
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Tournaments</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {list.map((t) => (
          <div key={t.id} className="card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{t.name}</h2>
                <p className="text-slate-300 text-sm">{t.type} • {t.players.length} players</p>
              </div>
              <Link className="btn" to={`/tournaments/${t.id}`}>Open</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

