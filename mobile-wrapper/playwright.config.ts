import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  retries: 1,
  use: { baseURL: 'http://localhost:4400', trace: 'on-first-retry' },
  projects: [ { name: 'Chromium', use: { ...devices['Desktop Chrome'] } } ],
  webServer: {
    command: 'npm run build && PORT=4400 node dist/server/index.js',
    url: 'http://localhost:4400',
    reuseExistingServer: !process.env.CI
  }
});

