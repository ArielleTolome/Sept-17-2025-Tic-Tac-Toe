import React from 'react';
import { Profile } from '../../core/identity';
import { Summary } from '../../core/models/summary';

export const SummaryBar: React.FC<{ profile: Profile; summary: Summary }> = ({ profile, summary }) => {
  const display = profile.displayName ?? `Player ${profile.userId.slice(0, 6)}`;
  return (
    <div className="summary-bar" role="region" aria-label="Player Summary" data-ui>
      <div className="level-ring" aria-label={`Level ${summary.level}`}>{summary.level}</div>
      <div>
        <div className="text-sm font-semibold" aria-live="polite">{display}</div>
        <div className="text-xs opacity-80">XP {summary.totalXp} • {Math.round(summary.progress * 100)}%</div>
      </div>
    </div>
  );
};

