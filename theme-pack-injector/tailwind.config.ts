import type { Config } from 'tailwindcss';

export default {
  content: ['./src/extension/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1f4ed8'
      }
    }
  },
  plugins: []
} satisfies Config;

