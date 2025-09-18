import { t } from '../i18n';
import type { ScoreboardRecord } from '@tic-tac-toe/shared';

interface ScoreboardProps {
  title?: string;
  record: ScoreboardRecord;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ title = t('game.scoreboard'), record }) => (
  <section aria-label={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <header className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-300">{title}</header>
    <dl className="grid grid-cols-3 gap-2 text-center text-sm font-medium">
      <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
        <dt className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">{t('game.wins')}</dt>
        <dd className="text-lg">{record.wins}</dd>
      </div>
      <div className="rounded-lg bg-rose-50 p-3 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
        <dt className="text-xs uppercase tracking-wide text-rose-600 dark:text-rose-300">{t('game.losses')}</dt>
        <dd className="text-lg">{record.losses}</dd>
      </div>
      <div className="rounded-lg bg-slate-100 p-3 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200">
        <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-200">{t('game.draws')}</dt>
        <dd className="text-lg">{record.draws}</dd>
      </div>
    </dl>
  </section>
);
