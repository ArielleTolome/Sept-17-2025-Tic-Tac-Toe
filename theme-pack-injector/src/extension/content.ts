import { getSiteKey, getThemeVars } from './storage';
import { varsToStyle } from './themes';

let styleEl: HTMLStyleElement | null = null;

async function apply() {
  const site = await getSiteKey();
  const vars = await getThemeVars(site);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.setAttribute('data-ttt-themes', '1');
    document.documentElement.appendChild(styleEl);
  }
  const css = `:root { ${varsToStyle(vars)} }`;
  styleEl.textContent = css;
}

// Initial
apply();

// Respond to popup updates
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'apply-theme') apply();
});

