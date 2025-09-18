import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/extension/popup.html'),
        background: resolve(__dirname, 'src/extension/background.ts'),
        content: resolve(__dirname, 'src/extension/content.ts')
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') return 'extension/background.js';
          if (chunk.name === 'content') return 'extension/content.js';
          return 'assets/[name].js';
        },
        assetFileNames: (asset) => {
          if (String(asset.name).endsWith('.css')) return 'extension/[name].[ext]';
          return 'assets/[name].[ext]';
        }
      }
    },
    emptyOutDir: true
  }
});

