import React, { useEffect, useMemo, useState } from 'react';
import { Drawer } from './components/Drawer';
import { Toasts } from './components/Toasts';
import { LevelUpModal } from './components/LevelUpModal';
import { useEventBus } from '../core/events/eventBus';
import { SummaryBar } from './components/SummaryBar';
import { getProfile } from '../core/identity';
import { selectSummary } from '../core/models/summary';
import '../overlay/styles/index.css';

export const App: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const bus = useEventBus();
  const [lvlup, setLvlup] = useState<{ level: number; totalXp: number } | null>(null);
  const [summary, setSummary] = useState(selectSummary());
  const profile = getProfile();

  useEffect(() => {
    const unsub = bus.on('LEVEL_UP', (p) => setLvlup({ level: p.level, totalXp: p.totalXp }));
    const unsub2 = bus.on('SUMMARY_UPDATED', () => setSummary(selectSummary()));
    return () => { unsub(); unsub2(); };
  }, [bus]);

  return (
    <div className="ttt-gamify" aria-live="polite" aria-label="Tic-Tac-Toe Gamify Overlay">
      <SummaryBar profile={profile} summary={summary} />
      <Drawer reducedMotion={reducedMotion} />
      <Toasts />
      {lvlup && (
        <LevelUpModal reducedMotion={reducedMotion} level={lvlup.level} totalXp={lvlup.totalXp} onClose={() => setLvlup(null)} />
      )}
    </div>
  );
};

