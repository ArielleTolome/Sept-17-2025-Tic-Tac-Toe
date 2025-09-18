import React from 'react';

export interface Match {
  id: string;
  round: number;
  a: string;
  b: string;
  winner?: string;
}

export default function Bracket({ matches }: { matches: Match[] }) {
  const rounds = Math.max(0, ...matches.map((m) => m.round));
  const byRound = Array.from({ length: rounds + 1 }, (_, r) => matches.filter((m) => m.round === r));
  return (
    <div className="overflow-auto">
      <div className="flex gap-6 min-w-[600px]">
        {byRound.map((roundMatches, r) => (
          <div key={r} className="space-y-4 w-64" aria-label={`Round ${r + 1}`}>
            <h3 className="font-semibold">Round {r + 1}</h3>
            {roundMatches.map((m) => (
              <div key={m.id} className="card" role="group" aria-label={`Match ${m.a} vs ${m.b}`}>
                <div className="flex items-center justify-between">
                  <span>{m.a}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${m.winner===m.a?'bg-green-700':''}`}>{m.winner===m.a?'WIN':''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{m.b}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${m.winner===m.b?'bg-green-700':''}`}>{m.winner===m.b?'WIN':''}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

