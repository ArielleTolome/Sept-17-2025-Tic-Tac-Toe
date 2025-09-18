import { RadioGroup } from '@headlessui/react';
import { Difficulty } from '@tic-tac-toe/shared';
import clsx from 'clsx';
import { t } from '../i18n';

const options = [
  { value: Difficulty.Easy, description: 'Relaxed pace with forgiving AI.' },
  { value: Difficulty.Medium, description: 'Balanced opponent with tactical play.' },
  { value: Difficulty.Impossible, description: 'Perfect play — can you draw every time?' },
];

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ value, onChange }) => (
  <RadioGroup value={value} onChange={onChange}>
    <RadioGroup.Label className="block text-sm font-semibold text-slate-500 dark:text-slate-300">
      {t('game.difficultyLabel')}
    </RadioGroup.Label>
    <div className="mt-2 grid gap-2">
      {options.map((option) => (
        <RadioGroup.Option
          key={option.value}
          value={option.value}
          className={({ checked }) =>
            clsx(
              'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
              checked
                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-500/20 dark:text-brand-100'
                : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200',
            )
          }
        >
          {({ checked }) => (
            <>
              <span
                className={clsx(
                  'mt-1 h-3 w-3 rounded-full border',
                  checked ? 'border-brand-600 bg-brand-600' : 'border-slate-400',
                )}
                aria-hidden="true"
              />
              <div>
                <RadioGroup.Label className="text-sm font-medium">
                  {t(`difficulty.${option.value}`)}
                </RadioGroup.Label>
                <RadioGroup.Description className="text-xs text-slate-500 dark:text-slate-300">
                  {option.description}
                </RadioGroup.Description>
              </div>
            </>
          )}
        </RadioGroup.Option>
      ))}
    </div>
  </RadioGroup>
);
