import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/client/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { primary: '#0ea5e9' }
    }
  },
  plugins: []
} satisfies Config;

