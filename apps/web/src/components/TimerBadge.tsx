import { useCountdown } from '../hooks/use-countdown';
import { t } from '../i18n';

interface TimerBadgeProps {
  expiresAt?: number | null;
}

export const TimerBadge: React.FC<TimerBadgeProps> = ({ expiresAt }) => {
  const remaining = useCountdown(expiresAt);
  const seconds = Math.ceil(remaining / 1000);

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200">
      <span aria-hidden="true">⏱️</span>
      <span>{t('game.timerLabel')}</span>
      <strong className="text-sm">{seconds}</strong>
    </div>
  );
};
