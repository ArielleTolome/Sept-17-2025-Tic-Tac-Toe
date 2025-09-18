import { createContext, useContext } from 'react';
import { en, type Translation } from './en';

type Replacements = Record<string, string | number>;

const I18nContext = createContext<Translation>(en);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nContext.Provider value={en}>{children}</I18nContext.Provider>
);

export const useI18n = () => useContext(I18nContext);

const walk = (source: Translation, path: string): unknown =>
  path.split('.').reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === 'object' && segment in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, source);

export const t = (path: string, replacements?: Replacements): string => {
  const value = walk(en, path);
  if (typeof value !== 'string') {
    return path;
  }
  if (!replacements) return value;
  return Object.entries(replacements).reduce(
    (acc, [key, val]) => acc.replaceAll(`{${key}}`, String(val)),
    value,
  );
};
