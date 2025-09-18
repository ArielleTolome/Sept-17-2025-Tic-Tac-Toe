import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { t } from '../i18n';
import { usePreferencesStore } from '../state/preferences';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const location = useLocation();
  const displayName = usePreferencesStore((state) => state.displayName);
  const setDisplayName = usePreferencesStore((state) => state.setDisplayName);
  const [value, setValue] = useState(displayName);

  const commit = () => {
    const trimmed = value.trim();
    setValue(trimmed);
    setDisplayName(trimmed);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-brand-600 hover:text-brand-500">
          <span aria-hidden="true">✨</span>
          <span>{t('app.name')}</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden text-sm text-slate-500 md:block" aria-live="polite">
            {location.pathname}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="display-name" className="sr-only">
              {t('home.displayNameLabel')}
            </label>
            <input
              id="display-name"
              name="display-name"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onBlur={commit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  commit();
                }
              }}
              placeholder={t('home.enterName')}
              className="w-40 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm text-slate-800 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
