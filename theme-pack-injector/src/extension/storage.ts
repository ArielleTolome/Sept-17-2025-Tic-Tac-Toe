import { THEMES, type ThemeKey } from './themes';

export async function getSiteKey(): Promise<string> {
  return new Promise((resolve) => {
    if (!chrome?.tabs) return resolve('unknown');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      try {
        const u = new URL(url);
        resolve(u.origin);
      } catch {
        resolve('unknown');
      }
    });
  });
}

export async function getThemeForSite(site: string): Promise<ThemeKey> {
  return new Promise((resolve) => {
    chrome.storage.local.get([`theme:${site}`], (obj) => {
      const key = (obj[`theme:${site}`] as ThemeKey) || 'system';
      resolve(key);
    });
  });
}

export async function setThemeForSite(site: string, theme: ThemeKey): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [`theme:${site}`]: theme }, () => resolve());
  });
}

export async function getThemeVars(site: string): Promise<Record<string, string>> {
  const key = await getThemeForSite(site);
  return THEMES[key].vars;
}

