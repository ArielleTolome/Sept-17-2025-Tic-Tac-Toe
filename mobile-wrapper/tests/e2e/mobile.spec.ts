import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test('loads wrapper and iframe', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('toolbar')).toBeVisible();
  await expect(page.locator('iframe[title="TicTacToe"]')).toBeVisible();
  await injectAxe(page);
  await checkA11y(page);
});

