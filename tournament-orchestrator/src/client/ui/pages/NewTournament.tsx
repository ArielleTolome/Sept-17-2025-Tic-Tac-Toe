import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewTournament() {
  const [name, setName] = useState('Demo Cup');
  const [type, setType] = useState<'round-robin' | 'single-elim'>('round-robin');
  const [playersText, setPlayersText] = useState('Alice\nBob\nCharlie\nDana');
  const nav = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const players = playersText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((n, i) => ({ id: String(i + 1), name: n }));
    const res = await fetch('/api/tournaments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, type, players })
    });
    const json = await res.json();
    nav(`/tournaments/${json.id}`);
  }

  return (
    <section className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold">New Tournament</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Type</span>
          <select className="input" value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="round-robin">Round Robin</option>
            <option value="single-elim">Single Elimination</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm">Players (one per line)</span>
          <textarea className="input h-40" value={playersText} onChange={(e) => setPlayersText(e.target.value)} />
        </label>
        <button className="btn" type="submit">Create</button>
      </form>
    </section>
  );
}

