import React from 'react';
import { getAchievements, getUnlocked } from '../../../core/achievements/engine';

export const AchievementsTab: React.FC = () => {
  const all = getAchievements();
  const unlocked = new Set(getUnlocked().map((a) => a.id));
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Achievements</h2>
      <div className="grid grid-cols-auto gap-3">
        {all.map((a) => (
          <div key={a.id} className="panel p-3 rounded border border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded bg-white/10 grid place-items-center" aria-hidden>
                <span aria-hidden>{a.icon}</span>
              </div>
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-xs opacity-80">{a.desc}</div>
              </div>
              <div className="ml-auto tag">{unlocked.has(a.id) ? 'Unlocked' : 'Locked'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

