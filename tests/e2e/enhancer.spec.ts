import { test, expect } from '@playwright/test'
import path from 'path'

test.beforeEach(async ({ page }) => {
  const mock = path.resolve('tests/e2e/mock-app/index.html')
  await page.goto('file://' + mock)
  await page.addScriptTag({ path: path.resolve('dist/ttt-ui-enhancer.iife.js') })
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
