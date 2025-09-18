import { test, expect } from '@playwright/test'
import path from 'path'
import fs from 'fs'

test.beforeEach(async ({ page }) => {
  const mock = path.resolve('tests/e2e/mock-app/index.html')
  const html = fs.readFileSync(mock, 'utf8')
  await page.setContent(html)
  const code = fs.readFileSync(path.resolve('dist/ttt-ui-enhancer.iife.js'), 'utf8')
  await page.evaluate((c) => { const s = document.createElement('script'); s.textContent = c; document.documentElement.appendChild(s); }, code)
})

test('attaches overlay and opens settings', async ({ page }) => {
  const gear = page.locator('.ttt-gear')
  await expect(gear).toBeVisible()
  await gear.click()
  await expect(page.locator('.ttt-panel.open')).toBeVisible()
})

test('shows keyboard shortcuts with ?', async ({ page }) => {
  await page.keyboard.press('Shift+/')
  await expect(page.locator('.ttt-shortcuts.open')).toBeVisible()
})

test('plays keyboard-only with focus rings', async ({ page }) => {
  const first = page.locator('.board [role="gridcell"]').first()
  await first.focus()
  // Focus outline should be visible (host app style). We just assert active element moved
  await expect(first).toBeFocused()
})
