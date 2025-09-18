import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'TTTGamify',
      fileName: (format) => `ttt-gamify.${format}.js`,
      formats: ['iife', 'es']
    },
    rollupOptions: {
      output: {
        globals: {},
      }
    },
    target: 'es2019'
  },
});

