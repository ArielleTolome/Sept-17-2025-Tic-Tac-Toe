import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Bracket from '../components/Bracket';

export default function TournamentView() {
  const { id } = useParams();
  const [data, setData] = useState<any>();
  useEffect(() => {
    fetch(`/api/tournaments/${id}`).then((r) => r.json()).then(setData);
  }, [id]);
  if (!data) return <p>Loading…</p>;
  const t = data;
  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t.name}</h1>
          <p className="text-slate-300 text-sm">{t.type} • {t.players.length} players</p>
        </div>
        <div className="flex gap-2">
          <a className="btn" href={`/api/tournaments/${id}/bracket.svg`} target="_blank" rel="noreferrer">Export SVG</a>
          <a className="btn" href={`/api/tournaments/${id}/bracket.pdf`} target="_blank" rel="noreferrer">Export PDF</a>
        </div>
      </header>
      <div className="card">
        <Bracket matches={t.matches} />
      </div>
    </section>
  );
}

