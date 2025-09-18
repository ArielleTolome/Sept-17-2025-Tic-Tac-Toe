import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/client/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { primary: '#16a34a' }
    }
  },
  plugins: []
} satisfies Config;

