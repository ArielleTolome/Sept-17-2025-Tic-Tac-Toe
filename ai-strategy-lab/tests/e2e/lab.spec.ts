import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('renders lab and heatmap', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('TTT Strategy Lab')).toBeVisible();
  await expect(page.locator('svg')).toBeVisible();
  await injectAxe(page);
  await checkA11y(page);
});

