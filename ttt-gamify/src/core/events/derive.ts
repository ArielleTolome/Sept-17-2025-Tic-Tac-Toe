import { discoverBoard } from './domDiscovery';
import { eventBus } from './eventBus';
import { loadXp, addXp, xpForOutcome } from '../models/xp';
import { ensureSummaryLoaded, selectSummary } from '../models/summary';
import { CONFIG } from '../config';
import { trackGameEnd, trackMove, loadAchievements } from '../achievements/engine';
import { getProfile } from '../identity';
import { updateLocalLeaderboard } from '../leaderboard';

type State = {
  startedAt: number;
  moveTimes: number[];
  firstMoveIndex?: number; // 0..8
  ended: boolean;
  cellTexts: string[];
};

let state: State = { startedAt: 0, moveTimes: [], ended: false, cellTexts: Array(9).fill('') };

function resetState() {
  state = { startedAt: performance.now(), moveTimes: [], firstMoveIndex: undefined, ended: false, cellTexts: Array(9).fill('') };
}

export async function bootEventLayer() {
  await ensureSummaryLoaded();
  await loadXp();
  await loadAchievements();
  eventBus.emit('SESSION_START');

  const hook = () => {
    const sel = discoverBoard();
    if (!sel.board || sel.cells.length !== 9) return;

    resetState();
    eventBus.emit('GAME_START');

    // Init cell texts
    state.cellTexts = sel.cells.map((c) => c.textContent?.trim() || '');

    // Observe text changes as moves
    const mo = new MutationObserver(() => {
      const next = sel.cells.map((c) => c.textContent?.trim() || '');
      for (let i = 0; i < 9; i++) {
        if (next[i] !== state.cellTexts[i]) {
          const t = performance.now();
          if (state.moveTimes.length === 0) state.firstMoveIndex = i;
          state.moveTimes.push(t);
          const delta = state.moveTimes.length > 1 ? (t - state.moveTimes[state.moveTimes.length-2]) : (t - state.startedAt);
          trackMove(delta);
          eventBus.emit('MOVE', { index: i, value: next[i] });
        }
      }
      state.cellTexts = next;
    });
    mo.observe(sel.board, { childList: true, subtree: true, characterData: true });

    // Listen for click without interference
    const onClick = () => {
      // Do nothing; reserved for potential timing metrics
    };
    sel.board.addEventListener('click', onClick, true);

    // Outcome detection via heuristic
    const outcomeWatcher = new MutationObserver(() => checkOutcome());
    outcomeWatcher.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true });

    function checkOutcome() {
      if (state.ended) return;
      const txt = document.body.textContent?.toLowerCase() || '';
      // Heuristics
      let outcome: 'win'|'loss'|'draw'|null = null;
      if (/you win|you won|victory|winner/.test(txt)) outcome = 'win';
      else if (/you lose|defeat|lost/.test(txt)) outcome = 'loss';
      else if (/draw|tie|stalemate/.test(txt)) outcome = 'draw';

      // fallback: if all cells filled and no outcome in 3s
      const allFilled = state.cellTexts.filter(Boolean).length === 9;
      if (!outcome && allFilled) {
        setTimeout(() => {
          if (!state.ended) end('draw');
        }, 3000);
      }
      if (outcome) end(outcome);
    }

    async function end(outcome: 'win'|'loss'|'draw') {
      if (state.ended) return; state.ended = true;
      const totalMs = performance.now() - state.startedAt;
      trackGameEnd(outcome, { totalMs, moves: state.cellTexts.filter(Boolean).length, firstMoveIndex: state.firstMoveIndex });
      const isOnline = location.href.includes('/room') || /online|lobby|room/i.test(document.body.textContent || '');
      const xp = xpForOutcome(
        outcome === 'win' ? (isOnline ? 'win_online' : 'win_local') : (outcome === 'draw' ? 'draw' : 'loss'),
        { firstGameOfDay: true, totalMs, streakBonus: 0, cap: CONFIG.DAILY_XP_CAP }
      );
      const { level, totalXp } = await addXp(xp);
      if (level) eventBus.emit('LEVEL_UP', { level, totalXp });
      eventBus.emit('TOAST', { id: 'xp-'+Date.now(), text: `Match result: ${outcome} (+${xp} XP)` });
      updateLocalLeaderboard();
      cleanup();
    }

    function cleanup() {
      sel.board.removeEventListener('click', onClick, true);
      mo.disconnect();
      outcomeWatcher.disconnect();
    }
  };

  // Initial hook and on DOM changes (in case the host app navigates)
  const tryHook = () => {
    try { hook(); } catch {}
  };
  tryHook();
  const mo = new MutationObserver(() => tryHook());
  mo.observe(document.body, { childList: true, subtree: true });
}

