import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 20_000,
  reporter: 'list',
  use: { browserName: 'chromium', headless: true },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
})
