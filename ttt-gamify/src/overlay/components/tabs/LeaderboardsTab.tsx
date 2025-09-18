import React from 'react';
import { getLocalLeaderboard } from '../../../core/leaderboard';

export const LeaderboardsTab: React.FC = () => {
  const local = getLocalLeaderboard();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Leaderboards</h2>
      <h3 className="font-semibold mt-2 mb-1">Local</h3>
      <ol className="grid gap-1 list-decimal list-inside">
        {local.map((r) => (
          <li key={r.userId} className="panel p-2 rounded border border-white/10 flex justify-between">
            <span>{r.displayName ?? r.userId.slice(0,6)}</span>
            <span className="text-sm opacity-80">Lvl {r.level} • {r.totalXp} XP • {r.stars} ★</span>
          </li>
        ))}
      </ol>
      <p className="text-xs opacity-70 mt-3">Global leaderboard requires Sidecar API and an anonymous token.</p>
    </div>
  );
};

