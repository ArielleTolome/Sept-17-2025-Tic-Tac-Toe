import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/client/**/*.{ts,tsx}'],
  theme: { extend: { colors: { primary: '#22c55e' } } },
  plugins: []
} satisfies Config;

