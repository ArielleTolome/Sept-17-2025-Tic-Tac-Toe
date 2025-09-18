import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/client/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1f4ed8',
          600: '#1f4ed8',
          700: '#1e40af'
        },
        contrast: {
          bg: '#0b0f19',
          fg: '#f4f7ff'
        }
      }
    }
  },
  plugins: []
} satisfies Config;

