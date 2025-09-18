import React, { useState } from 'react';
import { getDailyChallenge, puzzlesCatalog } from '../../../core/puzzles';

export const PuzzlesTab: React.FC = () => {
  const [daily] = useState(getDailyChallenge());
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Puzzles</h2>
      <div className="panel p-3 rounded border border-white/10 mb-3">
        <div className="font-semibold mb-1">Challenge of the Day</div>
        <div className="text-sm opacity-80">{daily.title}</div>
        <div className="mt-2 text-xs">Reward: +{daily.rewardXp} XP • +{daily.rewardStars} ★</div>
      </div>
      <h3 className="font-semibold mb-2">Curated</h3>
      <div className="grid grid-cols-auto gap-3">
        {puzzlesCatalog().map((p) => (
          <div key={p.id} className="panel p-3 rounded border border-white/10">
            <div className="font-semibold">{p.title}</div>
            <div className="text-xs opacity-80">Moves to solve: {p.moves}</div>
          </div>
        ))}
      </div>
      <p className="text-xs opacity-70 mt-3">Puzzles run in an overlay sandbox board and never touch the host game.</p>
    </div>
  );
};

