import React from 'react';
import { getActiveQuests, claimQuest } from '../../../core/quests/engine';

export const QuestsTab: React.FC = () => {
  const quests = getActiveQuests();
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Daily & Weekly Quests</h2>
      <div className="grid grid-cols-auto gap-3">
        {quests.map((q) => (
          <div key={q.id} className="panel p-3 rounded border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{q.name}</div>
                <div className="text-xs opacity-80">{q.desc}</div>
              </div>
              <span className="tag">{q.type}</span>
            </div>
            <div className="mt-2 text-sm">{q.progress}/{q.target}</div>
            <div className="mt-2 flex gap-2 items-center">
              <span className="tag">+{q.rewardXp} XP</span>
              <span className="tag">+{q.rewardStars} ★</span>
              <button className="btn btn-primary ml-auto" disabled={!q.claimable} onClick={() => claimQuest(q.id)}>Claim</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

