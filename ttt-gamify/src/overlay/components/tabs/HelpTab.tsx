import React from 'react';

export const HelpTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Help</h2>
      <ul className="list-disc list-inside text-sm opacity-90 space-y-1">
        <li>Overlay is non-destructive: it never edits the host DOM.</li>
        <li>Pointer events are only enabled on overlay components.</li>
        <li>Keyboard shortcuts: Alt+G toggles Hub, Alt+K opens Shortcuts.</li>
        <li>Reduced-motion honored if set in OS/browser.</li>
      </ul>
    </div>
  );
};

