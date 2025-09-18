import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
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
