import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'],
      lines: 0.9,
      statements: 0.9,
      functions: 0.9,
      branches: 0.9,
    },
  },
});
