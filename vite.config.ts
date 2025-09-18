import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['tests/e2e/**', '**/node_modules/**'],
    setupFiles: ['tests/setup.ts']
  },
  build: {
    lib: {
      entry: 'src/main.ts',
      name: 'TTTEnhancer',
      formats: ['iife'],
      fileName: () => 'ttt-ui-enhancer.iife.js'
    },
    rollupOptions: {
      output: {
        extend: true
      }
    }
  }
})
