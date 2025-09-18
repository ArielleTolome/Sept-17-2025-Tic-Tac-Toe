import React, { useEffect, useState } from 'react';

type Row = { name: string; elo: number; games: number; wins: number; losses: number; draws: number };

export default function App() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/leaderboard').then(r=>r.json()).then((d)=>setRows(d.rows||[])).finally(()=>setLoading(false));
  }, []);
  return (
    <section className="container mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leaderboard (ELO)</h1>
        <div className="flex gap-2">
          <a className="btn" href="/api/leaderboard.csv">Export CSV</a>
        </div>
      </header>
      <div className="card overflow-auto">
        {loading ? <p>Loading…</p> : (
          <table className="min-w-full">
            <thead className="text-left">
              <tr><th className="p-2">#</th><th className="p-2">Name</th><th className="p-2">ELO</th><th className="p-2">Games</th><th className="p-2">W</th><th className="p-2">L</th><th className="p-2">D</th></tr>
            </thead>
            <tbody>
              {rows.map((r,i)=> (
                <tr key={r.name} className="border-t border-slate-700">
                  <td className="p-2">{i+1}</td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{Math.round(r.elo)}</td>
                  <td className="p-2">{r.games}</td>
                  <td className="p-2">{r.wins}</td>
                  <td className="p-2">{r.losses}</td>
                  <td className="p-2">{r.draws}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

