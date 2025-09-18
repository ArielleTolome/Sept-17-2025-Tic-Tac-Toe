import type { PlayerSlot, Spectator } from '@tic-tac-toe/shared';
import clsx from 'clsx';
import { t } from '../i18n';
import type { Seat } from '../state/online-game';

interface PresencePanelProps {
  players: PlayerSlot[];
  spectators: Spectator[];
  selfId?: string;
  seat?: Seat;
}

export const PresencePanel: React.FC<PresencePanelProps> = ({ players, spectators, selfId, seat }) => (
  <section className="space-y-4">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <header className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
        {t('game.players')}
      </header>
      <ul className="space-y-2 text-sm">
        {players.map((player) => (
          <li
            key={player.id}
            className={clsx(
              'flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-slate-700 dark:border-slate-700 dark:text-slate-200',
              player.id === selfId && 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-500/10 dark:text-brand-200',
            )}
          >
            <span className="font-medium">
              {player.name || `Player ${player.mark}`} ({player.mark})
            </span>
            <span className={clsx('text-xs', player.isReady ? 'text-emerald-500' : 'text-slate-400')}>
              {player.isReady ? t('game.ready') : t('game.away')}
            </span>
          </li>
        ))}
        {players.length === 0 ? (
          <li className="text-xs text-slate-400">{t('game.waitingForOpponent')}</li>
        ) : null}
      </ul>
    </div>
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <header className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
        {t('game.spectators')}
      </header>
      <ul className="space-y-2 text-sm">
        {spectators.map((spectator) => (
          <li key={spectator.id} className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
            {spectator.name || 'Guest'}
          </li>
        ))}
        {spectators.length === 0 ? (
          <li className="text-xs text-slate-400">{t('game.noSpectators')}</li>
        ) : null}
      </ul>
    </div>
    {seat === 'spectator' ? (
      <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-100">
        You are viewing as a spectator. Chat is enabled but you cannot make moves.
      </p>
    ) : null}
  </section>
);
