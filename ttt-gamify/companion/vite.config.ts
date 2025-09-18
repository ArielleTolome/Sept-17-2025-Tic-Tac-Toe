import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'companion',
  plugins: [react()],
  server: { port: 5176 },
  build: { outDir: '../dist/companion' },
});

