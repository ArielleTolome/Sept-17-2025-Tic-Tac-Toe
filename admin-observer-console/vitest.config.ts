import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: { provider: 'v8', reporter: ['text', 'html'], lines: 90, functions: 90, branches: 80, statements: 90 }
  }
});

