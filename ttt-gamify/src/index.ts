import { ensureOverlayRoot } from './overlay/root';
import { App } from './overlay/App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { bootEventLayer } from './core/events/derive';
import { loadProfile } from './core/identity';
import { initStorage } from './core/storage';
import { getReducedMotion } from './core/reducedMotion';

declare global {
  interface Window {
    __TTT_GAMIFY_LOADED__?: boolean;
  }
}

async function main() {
  if (window.__TTT_GAMIFY_LOADED__) return;
  window.__TTT_GAMIFY_LOADED__ = true;

  await initStorage();
  await loadProfile();
  const reducedMotion = getReducedMotion();

  const mount = ensureOverlayRoot();
  const root = createRoot(mount);
  root.render(React.createElement(App, { reducedMotion }));

  // Boot event layer after mount to ensure UI exists
  bootEventLayer();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', main, { once: true });
} else {
  main();
}

