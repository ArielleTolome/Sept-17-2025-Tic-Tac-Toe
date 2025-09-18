import React, { useState } from 'react';
import { getProfile, updateProfile } from '../../../core/identity';
import { selectSummary } from '../../../core/models/summary';

export const ProfileTab: React.FC = () => {
  const profile = getProfile();
  const summary = selectSummary();
  const [name, setName] = useState(profile.displayName ?? '');

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Identity</h2>
      <p className="text-sm opacity-80 mb-2">Anonymous ID: <code>{profile.userId}</code></p>
      <label className="block mb-2">
        <span className="text-sm">Display Name</span>
        <input className="w-full mt-1 p-2 rounded bg-white/5 border border-white/10" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      </label>
      <button className="btn btn-primary" onClick={() => updateProfile({ displayName: name.trim() || undefined })}>Save</button>

      <div className="mt-4">
        <h3 className="font-semibold">Progress</h3>
        <div className="text-sm">Level {summary.level} • {summary.totalXp} XP • {Math.round(summary.progress*100)}%</div>
      </div>
    </div>
  );
};

