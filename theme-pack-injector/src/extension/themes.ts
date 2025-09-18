export type ThemeKey = 'system' | 'high-contrast' | 'dyslexia' | 'solarized-dark' | 'pastel';

export const THEMES: Record<ThemeKey, { label: string; vars: Record<string, string> }> = {
  'system': { label: 'System Default', vars: {} },
  'high-contrast': {
    label: 'High Contrast',
    vars: {
      '--bg': '#000000', '--fg': '#ffffff', '--primary': '#00ffff', '--accent': '#ff00ff'
    }
  },
  'dyslexia': {
    label: 'Dyslexia-Friendly',
    vars: {
      '--bg': '#f5f5f5', '--fg': '#111111', '--primary': '#1f4ed8', '--font-family': 'OpenDyslexic, Arial, sans-serif', '--line-height': '1.6'
    }
  },
  'solarized-dark': {
    label: 'Solarized (Dark)',
    vars: {
      '--bg': '#002b36', '--fg': '#eee8d5', '--primary': '#268bd2', '--accent': '#b58900'
    }
  },
  'pastel': {
    label: 'Pastel',
    vars: {
      '--bg': '#10131a', '--fg': '#f7f7ff', '--primary': '#a78bfa', '--accent': '#34d399'
    }
  }
};

export function varsToStyle(vars: Record<string, string>): string {
  return Object.entries(vars).map(([k, v]) => `${k}: ${v};`).join(' ');
}

