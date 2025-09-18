import type { StoredLocalResult } from '@tic-tac-toe/shared';
import { t } from '../i18n';

interface RecentResultsProps {
  results: ReadonlyArray<StoredLocalResult & { mode: 'single' | 'local' }>;
}

const outcomeLabel: Record<StoredLocalResult['outcome'], string> = {
  win: t('game.wins'),
  loss: t('game.losses'),
  draw: t('game.draws'),
};

const modeLabel: Record<'single' | 'local', string> = {
  single: t('home.singlePlayer'),
  local: t('home.localMultiplayer'),
};

export const RecentResults: React.FC<RecentResultsProps> = ({ results }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <header className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
      {t('home.recentResults')}
    </header>
    {results.length === 0 ? (
      <p className="text-sm text-slate-500 dark:text-slate-300">{t('game.emptyHistory')}</p>
    ) : (
      <ul className="space-y-2 text-sm">
        {results.map((result) => (
          <li key={result.playedAt} className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800 dark:text-slate-200">
            <span>{result.opponent}</span>
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
              {modeLabel[result.mode]} • {outcomeLabel[result.outcome]}
            </span>
          </li>
        ))}
      </ul>
    )}
  </section>
);
