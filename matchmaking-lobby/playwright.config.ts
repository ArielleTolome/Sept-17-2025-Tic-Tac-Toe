import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:4100',
    trace: 'on-first-retry'
  },
  projects: [ { name: 'Chromium', use: { ...devices['Desktop Chrome'] } } ],
  webServer: {
    command: 'npm run build && PORT=4100 node dist/server/index.js',
    url: 'http://localhost:4100',
    reuseExistingServer: !process.env.CI
  }
});

