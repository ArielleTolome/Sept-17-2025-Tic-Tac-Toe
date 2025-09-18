import type { MoveRecord, TimeTravelEntry } from '@tic-tac-toe/shared';
import clsx from 'clsx';
import { t } from '../i18n';

interface MoveHistoryProps {
  moves: readonly MoveRecord[];
  history: readonly TimeTravelEntry[];
  pointer: number;
  onSelect: (index: number) => void;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves, history, pointer, onSelect }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <header className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
      {t('game.moveHistory')}
    </header>
    {moves.length === 0 ? (
      <p className="text-sm text-slate-500 dark:text-slate-400">{t('game.emptyHistory')}</p>
    ) : (
      <ol className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1 text-sm" aria-live="polite">
        {history.map((entry, index) => (
          <li key={`${entry.index}-${index}`}>
            <button
              type="button"
              onClick={() => onSelect(index)}
              className={clsx(
                'flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
                pointer === index
                  ? 'bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
              )}
            >
              <span>
                {index === 0
                  ? t('game.startPosition')
                  : `${moves[index - 1]?.player ?? ''} → ${moves[index - 1]?.index ?? ''}`}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-300">#{index}</span>
            </button>
          </li>
        ))}
      </ol>
    )}
  </section>
);
