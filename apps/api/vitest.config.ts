import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: {
        lines: 0.8,
        statements: 0.8,
        functions: 0.8,
        branches: 0.75,
      },
    },
  },
});
