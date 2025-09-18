import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('loads charts and passes axe', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Analytics Dashboard')).toBeVisible();
  // wait for charts to render
  await expect(page.locator('canvas, svg').first()).toBeVisible();
  await injectAxe(page);
  await checkA11y(page);
});

