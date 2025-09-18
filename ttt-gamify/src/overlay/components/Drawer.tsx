import React, { useState } from 'react';
import { ProfileTab } from './tabs/ProfileTab';
import { QuestsTab } from './tabs/QuestsTab';
import { AchievementsTab } from './tabs/AchievementsTab';
import { StoreTab } from './tabs/StoreTab';
import { LeaderboardsTab } from './tabs/LeaderboardsTab';
import { PuzzlesTab } from './tabs/PuzzlesTab';
import { SettingsTab } from './tabs/SettingsTab';
import { HelpTab } from './tabs/HelpTab';

const tabs = [
  { id: 'profile', label: 'Profile', comp: ProfileTab },
  { id: 'quests', label: 'Quests', comp: QuestsTab },
  { id: 'ach', label: 'Achievements', comp: AchievementsTab },
  { id: 'store', label: 'Store', comp: StoreTab },
  { id: 'lead', label: 'Leaderboards', comp: LeaderboardsTab },
  { id: 'puzzles', label: 'Puzzles', comp: PuzzlesTab },
  { id: 'settings', label: 'Settings', comp: SettingsTab },
  { id: 'help', label: 'Help', comp: HelpTab },
];

export const Drawer: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const Comp = tabs[tab].comp;
  return (
    <div className="drawer" aria-label="Companion Hub" data-ui>
      <button
        className="btn btn-primary absolute left-[-44px] top-10 rotate-90 origin-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ttt-gamify-drawer"
      >
        {open ? 'Close' : 'Open'} Hub
      </button>
      <div
        id="ttt-gamify-drawer"
        role="dialog"
        aria-modal="false"
        className="panel h-full w-full shadow-xl border-l border-white/10"
        style={{ transform: `translateX(${open ? '0' : '100%'})`, transition: reducedMotion ? undefined : 'transform 200ms ease' }}
      >
        <nav className="flex gap-2 p-2 border-b border-white/10" role="tablist" aria-label="Companion Hub Tabs">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              className={`btn btn-ghost ${i === tab ? 'bg-white/10' : ''}`}
              role="tab"
              aria-selected={i === tab}
              aria-controls={`tab-${t.id}`}
              onClick={() => setTab(i)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <section id={`tab-${tabs[tab].id}`} role="tabpanel" className="p-3 overflow-y-auto h-[calc(100%-48px)]">
          <Comp />
        </section>
      </div>
    </div>
  );
};

