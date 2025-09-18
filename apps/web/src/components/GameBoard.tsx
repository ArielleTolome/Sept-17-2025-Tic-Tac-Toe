import { useMemo } from 'react';
import clsx from 'clsx';
import { type Board, type PlayerMark } from '@tic-tac-toe/shared';
import { t } from '../i18n';
import { useGameboardNavigation } from '../hooks/use-gameboard-navigation';

interface GameBoardProps {
  board: Board;
  turn: PlayerMark;
  winningLine: number[] | null;
  disabled?: boolean;
  onSelect: (index: number) => void;
  aiThinking?: boolean;
  statusMessage?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  turn,
  winningLine,
  disabled = false,
  onSelect,
  aiThinking = false,
  statusMessage,
}) => {
  const available = useMemo(() => board.map((cell, index) => (cell === null ? index : -1)).filter((index) => index >= 0), [board]);
  const { focusedIndex, setFocusedIndex, onKeyDown } = useGameboardNavigation(available);

  return (
    <div
      className="grid w-full max-w-sm gap-4"
      role="grid"
      aria-label={t('accessibility.boardLabel')}
      aria-live="polite"
    >
      <div className="grid aspect-square grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-3 shadow-inner dark:bg-slate-800">
        {board.map((cell, index) => {
          const isWinning = winningLine?.includes(index) ?? false;
          const isEmpty = cell === null;
          const label = isEmpty
            ? t('accessibility.placeMark', { mark: turn, index: index + 1 })
            : t('accessibility.markPlaced', { mark: cell ?? '', index: index + 1 });

          return (
            <button
              key={index}
              type="button"
              role="gridcell"
              aria-label={label}
              aria-pressed={!isEmpty}
              disabled={disabled || !isEmpty}
              tabIndex={focusedIndex === index ? 0 : -1}
              onFocus={() => setFocusedIndex(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  if (!disabled && isEmpty) {
                    onSelect(index);
                  }
                }
                onKeyDown(event);
              }}
              onClick={() => {
                if (!disabled && isEmpty) {
                  onSelect(index);
                }
              }}
              className={clsx(
                'relative flex h-full items-center justify-center rounded-xl border border-slate-200 bg-white text-4xl font-semibold text-slate-600 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 hover:border-brand-300 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
                isWinning && 'border-brand-500 bg-brand-100 text-brand-700 dark:border-brand-400 dark:bg-brand-500/10 dark:text-brand-200',
              )}
            >
              {cell ? (
                <span className="animate-pop drop-shadow-sm" aria-hidden="true">
                  {cell}
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className={clsx(
                    'pointer-events-none select-none text-3xl font-semibold uppercase tracking-wide text-slate-200 transition dark:text-slate-700',
                    !disabled && !aiThinking && focusedIndex === index && 'text-brand-300 dark:text-brand-600',
                  )}
                >
                  {turn}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="text-center text-sm text-slate-500 dark:text-slate-400">
        {statusMessage ?? (aiThinking ? t('game.aiTurn') : t('game.yourTurn'))}
      </div>
    </div>
  );
};
