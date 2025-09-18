import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 0,
  use: { baseURL: process.env.PUBLIC_WEB_URL || 'http://localhost:5173', trace: 'on-first-retry' },
  projects: [ { name: 'Chromium', use: { ...devices['Desktop Chrome'] } } ]
});

