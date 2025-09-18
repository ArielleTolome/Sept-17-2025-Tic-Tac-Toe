import React from 'react';
import { exportPrefs, importPrefs, resetPrefs } from '../../../core/storage';

export const SettingsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Settings</h2>
      <div className="flex gap-2 flex-wrap">
        <button className="btn btn-ghost" onClick={async () => {
          const blob = new Blob([JSON.stringify(await exportPrefs(), null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'ttt-gamify-prefs.json'; a.click(); URL.revokeObjectURL(url);
        }}>Export Preferences</button>
        <label className="btn btn-ghost cursor-pointer">
          Import Preferences
          <input type="file" accept="application/json" className="sr-only" onChange={async (e) => {
            const file = e.currentTarget.files?.[0];
            if (!file) return;
            const text = await file.text();
            await importPrefs(JSON.parse(text));
            alert('Imported preferences. Reload page.');
          }} />
        </label>
        <button className="btn btn-ghost" onClick={() => { if (confirm('Reset all local data?')) resetPrefs(); }}>Reset All</button>
      </div>
      <div className="mt-4 text-xs opacity-70">Privacy: No PII. Data stored locally. Optional Sidecar API uses anonymous tokens.</div>
    </div>
  );
};

