import React from 'react';

export const LevelUpModal: React.FC<{ level: number; totalXp: number; reducedMotion: boolean; onClose: () => void }> = ({ level, totalXp, reducedMotion, onClose }) => {
  return (
    <div role="dialog" aria-modal="true" aria-label="Level Up" className="fixed inset-0 grid place-items-center" data-ui>
      <div className="panel rounded-xl p-5 shadow-2xl border border-white/10">
        <h2 className="text-xl font-bold">Level Up!</h2>
        <p className="mt-1">You reached Level {level} • Total XP {totalXp}</p>
        <div className="mt-3 flex justify-end">
          <button className="btn btn-primary" onClick={onClose}>Continue</button>
        </div>
      </div>
    </div>
  );
};

