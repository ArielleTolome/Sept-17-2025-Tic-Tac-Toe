import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { THEMES, type ThemeKey } from './themes';
import { getSiteKey, getThemeForSite, setThemeForSite } from './storage';
import './popupStyles.css';

function Popup() {
  const [site, setSite] = useState<string>('');
  const [theme, setTheme] = useState<ThemeKey>('system');

  useEffect(() => {
    (async () => {
      const key = await getSiteKey();
      setSite(key);
      const t = await getThemeForSite(key);
      setTheme(t);
    })();
  }, []);

  async function applyTheme(next: ThemeKey) {
    setTheme(next);
    const key = site || (await getSiteKey());
    await setThemeForSite(key, next);
    // Inform the content script in active tab
    if (chrome?.tabs) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) chrome.tabs.sendMessage(tab.id, { type: 'apply-theme' });
    }
  }

  return (
    <div className="w-80 p-3 space-y-3">
      <h1 className="text-xl font-bold">TTT Theme Pack</h1>
      <p className="text-slate-300 text-sm break-all">Site: {site || 'unknown'}</p>
      <div className="grid gap-2" role="group" aria-label="Theme presets">
        {Object.entries(THEMES).map(([key, t]) => (
          <button
            key={key}
            className={`btn ${theme === key ? 'btn-active' : ''}`}
            onClick={() => applyTheme(key as ThemeKey)}
            aria-pressed={theme === key}
          >
            {t.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-400">Themes apply via CSS variables. High-contrast and dyslexia-friendly included.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);

