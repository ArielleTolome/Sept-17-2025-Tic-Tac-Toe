import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
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
